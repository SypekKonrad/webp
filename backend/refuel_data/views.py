from rest_framework.views import APIView
from rest_framework.response import Response
from google.oauth2.service_account import Credentials
import gspread
import pandas as pd
import numpy as np
from rest_framework import status

# Google Sheets auth
SERVICE_ACCOUNT_FILE = 'toyota-avensis-441923-f7a47164daac.json'
SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive"
]

class GetCarData(APIView):
    def get(self, request, format=None):
        try:
            credentials = Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE, scopes=SCOPES)
            gc = gspread.authorize(credentials)

            spreadsheet_name = "toyota avensis t22"
            spreadsheet = gc.open(spreadsheet_name)
            sheet = spreadsheet.sheet1

            raw_data = sheet.get_all_values()

            df = pd.DataFrame(raw_data[4:], columns=raw_data[0])
            selected_columns = df.iloc[:, [11, 12, 13, 14]].copy()
            selected_columns.columns = ['Date', 'Price', 'Kilometers Traveled', 'Liters']

            selected_columns.replace('', np.nan, inplace=True)
            selected_columns.dropna(inplace=True)

            cleaned_data = selected_columns.to_dict(orient='records')

            return Response(cleaned_data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)