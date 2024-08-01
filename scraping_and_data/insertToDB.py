import pandas as pd
from sqlalchemy import create_engine, text

# Define your PostgreSQL connection details
user = ''
password = ''
host = ''
port = ''
database = ''

# Create a connection string
conn_string = f'postgresql://{user}:{password}@{host}:{port}/{database}'

# Create an engine
engine = create_engine(conn_string)

def insert_hadith_data(csv_file, engine):
    schema = 'hadisler2'  # Specify the schema
    # Read the CSV file with explicit quoting and encoding
    df = pd.read_csv(csv_file, quotechar='"', escapechar='\\', doublequote=True, skipinitialspace=True, dtype={'page_index': str}, encoding='utf-8-sig')
    # Insert data into the database
    df.to_sql('hadiths', engine, if_exists='append', index=False, chunksize=1000, schema=schema)

def insert_ravi_data(csv_file, engine):
    schema = 'hadisler2'  # Specify the schema
    # Read the CSV file with explicit quoting and encoding
    df = pd.read_csv(csv_file, quotechar='"', escapechar='\\', doublequote=True, skipinitialspace=True, dtype={'page_index': str}, encoding='utf-8-sig')
    # Insert data into the database
    df.to_sql('ravis', engine, if_exists='append', index=False, chunksize=1000, schema=schema)

# Insert data
insert_hadith_data('hadith_data.csv', engine)
insert_ravi_data('ravi_data.csv',engine)
