import requests
from bs4 import BeautifulSoup
import csv
import uuid
import time
import os

BASE_URL = 'https://www.hadisveritabani.info/hadis/ara?kelimeg=ا&aramaTuru=ig&arama=g&sayfa='
OUTPUT_FILE = 'hadithv2.csv'
ERROR_FILE = 'hadithv2_errors.csv'
CHECKPOINT_FILE = 'hadithv2_checkpoint.txt'
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

def extract_musannif_and_book(book_element):
    musannif = ""
    book_name = ""
    
    user_icon = book_element.find('i', class_='fa-user')
    if user_icon:
        musannif_link = user_icon.find_next('a')
        if musannif_link:
            musannif = musannif_link.get_text(strip=True)
    
    book_icon = book_element.find('i', class_='fa-book')
    if book_icon:
        book_link = book_icon.find_next('a')
        if book_link:
            book_name = book_link.get_text(strip=True)
    
    return musannif, book_name

def parse_hadith_details(page_number, soup):
    arabic_hadith = soup.find_all('h3', class_='search')
    turkish = soup.find_all('p', class_='u-mb-small', align='justify')
    book = soup.find_all('ul', class_='u-mt-zero', align='right')
    topic = soup.find_all('div', class_='col-md-6 col-lg-4')
    chain = soup.find_all('div', class_='c-feed')

    hadiths = []
    for index, hadith in enumerate(arabic_hadith, start=1):
        unique_id = str(uuid.uuid4())
        arabic_text = ' '.join(hadith.get_text(separator=' ', strip=True).split())
        turkish_text = ' '.join(turkish[index - 1].get_text(separator=' ', strip=True).split()) if index <= len(turkish) else ""
        
        musannif, book_name = extract_musannif_and_book(book[index - 1]) if index <= len(book) else ("", "")
        
        topic_text = '; '.join(topic.get_text(strip=True) for topic in topic[index - 1].find_all('li')) if index <= len(topic) else ""
        chain_ids = [a['data-id'] for a in chain[index - 1].find_all('a', onclick='raviKarti(this)', attrs={'data-id': True})] if index <= len(chain) else []
        chain_text = '; '.join(chain_ids)
        page_index = f'{page_number}.{index}'

        hadiths.append([unique_id, arabic_text, turkish_text, musannif, book_name, topic_text, chain_text, page_index])
    
    return hadiths

def process_page(page_number, writer, error_writer):
    try:
        url = BASE_URL + str(page_number)
        content = fetch_page(url)
        if not content:
            error_writer.writerow([page_number, 'No content fetched'])
            return
        
        soup = BeautifulSoup(content, 'html.parser')
        hadiths = parse_hadith_details(page_number, soup)
        
        for hadith in hadiths:
            writer.writerow(hadith)
        
        print(f'Hadith page {page_number} has been processed')
    except Exception as e:
        error_writer.writerow([page_number, str(e)])
        print(f"Error processing page {page_number}: {e}")

def main():
    start_page = 7000
    try:
        if os.path.exists(CHECKPOINT_FILE):
            with open(CHECKPOINT_FILE, 'r') as f:
                start_page = int(f.read().strip())
    except FileNotFoundError:
        pass

    with open(OUTPUT_FILE, mode='a', newline='', encoding='utf-8') as hadith_file, \
         open(ERROR_FILE, mode='a', newline='', encoding='utf-8') as error_file:
        
        writer = csv.writer(hadith_file)
        error_writer = csv.writer(error_file)

        if hadith_file.tell() == 0:
            writer.writerow(['id', 'arabic', 'turkish', 'musannif', 'book', 'topic', 'chain', 'page_index'])
            error_writer.writerow(['Page Number', 'Error'])

        for page_number in range(start_page, 14000):
            time.sleep(1 / RATE_LIMIT)
            process_page(page_number, writer, error_writer)

            # Checkpoint
            with open(CHECKPOINT_FILE, 'w') as f:
                f.write(str(page_number))

    print('Hadiths have been successfully written to the file')

if __name__ == "__main__":
    main()