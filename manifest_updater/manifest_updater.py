import openpyxl
import os
import tempfile
import shutil
from datetime import datetime
import re
import json
import manifest_updater_config

def process_workbook(file_path, cursor, file_date, filenames_set):
    """
    Processes the xlsx file at the given file path and inserts the data into the manifest table in the database.
    
    Args:
        file_path (str): The path to the xlsx file to be processed.
        cursor (psycopg2.extensions.cursor): The cursor object used to interact with the database.
        file_date (str): The date of the file in the format 'YYYY-MM-DD'.
        filenames_set (set): A set containing the paths of the files that have already been processed.
    
    Returns:
        None
    """
    with tempfile.TemporaryDirectory() as tmpdirname:
        temp_file_path = os.path.join(tmpdirname, os.path.basename(file_path))
        shutil.copyfile(file_path, temp_file_path)
        wb = openpyxl.load_workbook(temp_file_path)
        ws = wb.active
        first_row = True
        for row in ws.iter_rows(values_only=True, min_row=1): 
            item_number, description, quantity, price = row[1:5]
            
            if item_number != "Item #" and first_row == True:
                print("Error with format of file")
                first_row = False
                break
            elif item_number == "Item #":
                first_row = False
                continue
            elif item_number == None and description == None:
                print("end of file or error reading file")
                break

            try:
                price_per_item = round(price/quantity, 2)
                cursor.execute(
                    '''
                    INSERT INTO manifest (manifest_item_number, manifest_description, manifest_price, manifest_last_received) 
                    VALUES (%s, %s, %s, %s)
                    ON CONFLICT (manifest_item_number) DO UPDATE
                    SET manifest_price = EXCLUDED.manifest_price,
                    manifest_description = EXCLUDED.manifest_description,
                    manifest_last_received = EXCLUDED.manifest_last_received
                    ''',
                    (item_number, description, price_per_item, file_date)
                )
            except Exception as e:
                print(e)
                print(f'Error: {file_path}, {item_number}')
                exit()
    filenames_set.add(file_path)
    print(f'adding {file_path} to checked set')


def extract_date(filename):
    """
    Extracts the date from the given filename.

    Args:
        filename (str): The name of the file to extract the date from.
    
    Returns:
        str: The date extracted from the filename in the format 'YYYY-MM-DD'.
    """
    date_pattern = r"\b\d{6}[a-zA-Z0-9]*\b"
    match = re.search(date_pattern, filename)
    if match:
        date_str = match.group(0)
        year = int(date_str[:2])
        month = int(date_str[2:4])
        day = int(date_str[4:6])
        return datetime(year + 2000, month, day).strftime('%Y-%m-%d')
    else:
        return None


def start_update():
    """
    Loads config settings from manifest_updater_config.py and commences the update process. 
    
    Returns:
        None
    """
    server = manifest_updater_config.server
    server.start()
    conn = manifest_updater_config.conn
    cursor = conn.cursor()

    with open('filenames.json', 'r') as f:
        loaded_list = json.load(f)

    filenames_set = set(loaded_list)
    manifests_path = manifest_updater_config.manifests_path
    subdirs = [(os.path.join(manifests_path, d), os.path.getctime(os.path.join(manifests_path, d))) 
            for d in os.listdir(manifests_path) if os.path.isdir(os.path.join(manifests_path, d))]
    sorted_subdirs = sorted(subdirs, key=lambda x: x[1], reverse=False)
    recent_subdirs = sorted_subdirs

    for subdir, _ in recent_subdirs:
        for file in os.listdir(subdir):
            if file.endswith(".xlsx"):
                if file.startswith('~$'):
                    print(f'skipped {file}')
                    continue
                file_path = os.path.join(subdir, file)
                file_date = extract_date(file)
                if file_path not in filenames_set:
                    process_workbook(file_path, cursor, file_date, filenames_set)
                else:
                    print(f'{file_path} already been checked')

    filename_set_as_list = list(filenames_set)

    with open('filenames.json', 'w') as f:
        json.dump(filename_set_as_list, f)

    conn.commit()
    cursor.close()
    conn.close()

if __name__ == "__main__":
    start_update()