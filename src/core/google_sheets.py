from pprint import pprint

from googleapiclient import discovery

from oauth2client.service_account import ServiceAccountCredentials

# Marg Journal spreadsheet_id: 1cM-yDqosHzSQ-K9ITPRIMST-aTJ6mF22LfYZnjMqO3g

# Connection
scopes = ['https://www.googleapis.com/auth/spreadsheets']
credentials = ServiceAccountCredentials.from_json_keyfile_name(
    '/sasha/src/core/google-sheets-creds.json', scopes=scopes)
service = discovery.build('sheets', 'v4', credentials=credentials)

# Config
cell_range = 'Sheet1!A:B'  # May need to change to A:Z to generalize or pass in
value_input_option = 'USER_ENTERED'
insert_data_option = 'INSERT_ROWS'


def insert_data(spreadsheet_id, rows):
    """
    Insert a list of rows to the provided spreadsheet. Rows is a list of lists.
    """

    value_range_body = {
        'values': rows
    }

    request = service.spreadsheets().values().append(
        spreadsheetId=spreadsheet_id,
        range=cell_range,
        valueInputOption=value_input_option,
        insertDataOption=insert_data_option,
        body=value_range_body
    )

    response = request.execute()
    return response
