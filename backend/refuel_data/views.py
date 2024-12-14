from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import CarDataSerializer
from google.oauth2.service_account import Credentials
import gspread
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from rest_framework import status
from io import BytesIO

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

class AnalyzeCarData(APIView):
    def get(self, request, format=None):
        try:
            response = GetCarData().get(request)
            if response.status_code != 200:
                return Response({"error": "Failed to fetch raw data"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            raw_data = response.data['data']
            df = pd.DataFrame(raw_data)

            # Convert columns to appropriate data types
            df['Date'] = pd.to_datetime(df['Date'], format='%d.%m.%Y')
            df['Price'] = df['Price'].astype(float)
            df['Kilometers_Traveled'] = df['Kilometers_Traveled'].astype(float)
            df['Liters'] = df['Liters'].astype(float)

            # Calculate derived metrics
            df['Fuel Efficiency (km/L)'] = df['Kilometers_Traveled'] / df['Liters']
            df['Total Expenditure'] = df['Price'] * df['Liters']
            df['Price per km'] = df['Total Expenditure'] / df['Kilometers_Traveled']
            df['Fuel consumption (L/100km)'] = (df['Liters'] / df['Kilometers_Traveled']) * 100

            # Assign seasons based on months
            def assign_season(month):
                if month in [12, 1, 2]:
                    return 'Winter'
                elif month in [3, 4, 5]:
                    return 'Spring'
                elif month in [6, 7, 8]:
                    return 'Summer'
                else:
                    return 'Autumn'

            df['Season'] = df['Date'].dt.month.apply(assign_season)

            # Perform seasonal analysis
            seasonal_analysis = df.groupby('Season').agg({
                'Fuel consumption (L/100km)': 'mean',
                'Fuel Efficiency (km/L)': 'mean'
            }).round(2).reset_index()

            # Calculate summary statistics
            total_expenditure = df['Total Expenditure'].sum()
            average_expenditure_per_refueling = df['Total Expenditure'].mean()
            average_price_per_km = df['Price per km'].mean()
            average_fuel_consumption = df['Fuel consumption (L/100km)'].mean()

            # Prepare response data
            analysis_results = {
                'total_expenditure': round(total_expenditure, 2),
                'average_expenditure_per_refueling': round(average_expenditure_per_refueling, 2),
                'average_price_per_km': round(average_price_per_km, 2),
                'average_fuel_consumption': round(average_fuel_consumption, 2),
                'seasonal_analysis': seasonal_analysis.to_dict(orient='records'),
            }

            # plt.style.use('seaborn-v0_8-darkgrid')
            # plt.figure(figsize=(14, 7))
            # plt.plot(df['Date'], df['Fuel consumption (L/100km)'], marker='o', label='Fuel Consumption (L/100km)', color='b')
            # plt.axhline(y=average_fuel_consumption, color='r', linestyle='--', label=f'Average: {average_fuel_consumption:.2f} L/100km')
            # plt.title("Fuel consumption Over Time", fontsize=16)
            # plt.xlabel("Date", fontsize=14)
            # plt.ylabel("Fuel consumption (L/100km)", fontsize=14)
            # plt.legend(fontsize=12)
            # plt.xticks(rotation=45)
            # plt.tight_layout()
            #
            # # Save the plot to a BytesIO object
            # img_io = BytesIO()
            # plt.savefig(img_io, format='png')
            # img_io.seek(0)
            # plt.close()
            #
            # # Convert plot to base64 (optional, if you prefer to send it as a base64 string)
            # plot_image = img_io.getvalue()

            return Response({
                "analysis": analysis_results,
                # "plot_image": plot_image
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)