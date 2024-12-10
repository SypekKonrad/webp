from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import CarDataSerializer
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
            # print("api call")
            credentials = Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE, scopes=SCOPES)
            gc = gspread.authorize(credentials)

            spreadsheet_name = "toyota avensis t22"
            # print(f"Accessing spreadsheet: {spreadsheet_name}")
            spreadsheet = gc.open(spreadsheet_name)
            sheet = spreadsheet.sheet1

            # print("Fetching from the spreadsheet")
            raw_data = sheet.get_all_values()
            # print(f"Raw data: {raw_data[:5]}")  # Print a sample of the raw data

            df = pd.DataFrame(raw_data[4:], columns=raw_data[0])
            selected_columns = df.iloc[:, [11, 12, 13, 14]].copy()
            selected_columns.columns = ['Date', 'Price', 'Kilometers_Traveled', 'Liters']
            # print(f"columns before cleaning: {selected_columns.head()}")

            selected_columns.replace('', np.nan, inplace=True)
            selected_columns.dropna(inplace=True)
            # print(f"columns after cleaning: {selected_columns.head()}")

            numeric_columns = ['Price', 'Kilometers_Traveled', 'Liters']
            for col in numeric_columns:
                # print(f"Processing column: {col}")
                selected_columns[col] = selected_columns[col].str.replace(',', '.').astype(float)
                # print(f"Data in column {col}: {selected_columns[col].head()}")

            cleaned_data = selected_columns.to_dict(orient='records')
            # print(f"Cleaned data: {cleaned_data}")

            serializer = CarDataSerializer(cleaned_data, many=True)
            return Response({"data": serializer.data}, status=status.HTTP_200_OK)
        except Exception as e:
            # print(f"Error: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)