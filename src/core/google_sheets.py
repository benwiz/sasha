from pprint import pprint

from googleapiclient import discovery

from oauth2client.service_account import ServiceAccountCredentials

scopes = ['https://www.googleapis.com/auth/spreadsheets']

credentials = ServiceAccountCredentials.from_json_keyfile_name(
    'google-sheets-creds.json', scopes=scopes)

service = discovery.build('sheets', 'v4', credentials=credentials)

# The ID of the spreadsheet to update.
spreadsheet_id = '1cM-yDqosHzSQ-K9ITPRIMST-aTJ6mF22LfYZnjMqO3g'

# The A1 notation of a range to search for a logical table of data.
# Values will be appended after the last row of the table.
range_ = 'A:B'

# How the input data should be interpreted.
value_input_option = 'USER_ENTERED'

# How the input data should be inserted.
insert_data_option = 'INSERT_ROWS'  # TODO: Update placeholder value.

value_range_body = {
    'values': [
        ['lol', 'hi']
    ]
}

pprint(value_range_body)

request = service.spreadsheets().values().append(spreadsheetId=spreadsheet_id, range=range_, valueInputOption=value_input_option, insertDataOption=insert_data_option, body=value_range_body)
response = request.execute()

pprint(response)
