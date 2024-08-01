import requests
from bs4 import BeautifulSoup
import csv
import json
import time

BASE_URL = 'https://www.hadisveritabani.info/ravi/ara?sayfa='
RAVI_BASE_URL = 'https://www.hadisveritabani.info/ravi/ajxRaviKarti?raviid='
OUTPUT_FILE = 'ravi_updated.csv'
ERROR_FILE = 'ravi_update_errors.csv'
CHECKPOINT_FILE = 'ravi_checkpoint.txt'
RAW_HTML_LOG_FILE = 'raw_html_log.txt'
RATE_LIMIT = 0.5  # requests per second

def fetch_page(url, retries=3):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    for _ in range(retries):
        try:
            response = requests.get(url, headers=headers)
            if response.status_code == 200:
                return response.text
        except requests.RequestException:
            pass
        time.sleep(2)
    print(f"Failed to fetch {url} after {retries} retries")
    return None

def fetch_ravi_details(data_id):
    url = RAVI_BASE_URL + data_id
    content = fetch_page(url)
    if content:
        try:
            return json.loads(content)
        except json.JSONDecodeError:
            print(f"Failed to decode JSON for Ravi ID {data_id}")
    return None

def process_page(page_number, writer, error_writer, seen_entries):
    try:
        url = BASE_URL + str(page_number)
        content = fetch_page(url)
        if not content:
            error_writer.writerow([page_number, '', 'No content fetched'])
            print(f'No content fetched from page {page_number}')
            return
        
        soup = BeautifulSoup(content, 'html.parser')
        rows = soup.select('tbody tr.c-table__row')
        
        if not rows:
            error_writer.writerow([page_number, '', 'No rows found'])
            with open(RAW_HTML_LOG_FILE, 'a', encoding='utf-8') as f:
                f.write(f"Page {page_number} HTML:\n{content}\n\n")
            print(f"No rows found on page {page_number}")
            return
        
        for row in rows:
            try:
                data_id = row.select_one('a.modalRaviKarti')['data-id']
                if data_id in seen_entries:
                    print(f"Duplicate entry {data_id} on page {page_number}, skipping...")
                    continue
                seen_entries.add(data_id)
                
                ravi_details = fetch_ravi_details(data_id)
                if not ravi_details:
                    error_writer.writerow([page_number, data_id, 'Failed to fetch ravi details'])
                    continue

                api_id = ravi_details.get('id')
                if api_id is None:
                    error_writer.writerow([page_number, data_id, 'No id in JSON response'])
                    continue

                new_row = {
                    'RAVI_ID': api_id,
                    'NARRATOR_NAME': ravi_details.get('Adi', ''),
                    'TRIBE': ravi_details.get('Kabilesi', ''),
                    'NISBESI': ravi_details.get('Nisbesi', ''),
                    'DEGREE': ravi_details.get('Derecesi', ''),
                    'RELIABILITY': ravi_details.get('Guvenilirligi', '')
                }
                writer.writerow(new_row)
                
                if data_id != api_id:
                    error_writer.writerow([page_number, data_id, api_id, 'Mismatch between DATA_ID and API ID'])
                
                print(f"Processed Ravi with DATA_ID: {data_id}, API ID: {api_id}")
            except Exception as e:
                error_writer.writerow([page_number, data_id, str(e)])
                print(f"Error processing row on page {page_number}: {e}")
        
        print(f'Ravi Page {page_number} has been processed')
    except Exception as e:
        error_writer.writerow([page_number, '', str(e)])
        print(f"Error processing page {page_number}: {e}")

def main():
    start_page = 1
    try:
        with open(CHECKPOINT_FILE, 'r') as f:
            content = f.read()
            start_page = int(content.strip())
    except FileNotFoundError:
        pass

    with open(OUTPUT_FILE, mode='a', newline='', encoding='utf-8') as ravi_file, \
         open(ERROR_FILE, mode='a', newline='', encoding='utf-8') as error_file:
        
        fieldnames = ['RAVI_ID', 'NARRATOR_NAME', 'TRIBE', 'NISBESI', 'DEGREE', 'RELIABILITY']
        writer = csv.DictWriter(ravi_file, fieldnames=fieldnames)
        error_writer = csv.writer(error_file)

        if start_page == 1:
            writer.writeheader()
            error_writer.writerow(['Page Number', 'DATA_ID', 'API_ID', 'Error'])

        seen_entries = set()

        for page_number in range(start_page, 1362):
            time.sleep(1 / RATE_LIMIT)  # Rate limiting
            process_page(page_number, writer, error_writer, seen_entries)

            # Checkpoint
            with open(CHECKPOINT_FILE, 'w') as f:
                f.write(str(page_number))

    print('Narrators have been successfully written to the file')

if __name__ == "__main__":
    main()