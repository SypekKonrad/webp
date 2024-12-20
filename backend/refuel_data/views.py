import base64

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

            # style of grid
            plt.style.use('seaborn-v0_8-darkgrid')

            # plot1 / fuel consump. over time plot
            plt.figure(figsize=(14, 7))
            plt.plot(df['Date'], df['Fuel consumption (L/100km)'], marker='o', label='Fuel Consumption (L/100km)', color='b')
            plt.axhline(y=average_fuel_consumption, color='r', linestyle='--', label=f'Average: {average_fuel_consumption:.2f} L/100km')
            plt.title("Fuel consumption Over Time", fontsize=16)
            plt.xlabel("Date", fontsize=14)
            plt.ylabel("Fuel consumption (L/100km)", fontsize=14)
            plt.legend(fontsize=12)
            plt.xticks(rotation=45)
            plt.tight_layout()
            # bytes / plot1
            img_io = BytesIO()
            plt.savefig(img_io, format='png')
            img_io.seek(0)
            plt.close()
            plot1_image = base64.b64encode(img_io.getvalue()).decode('utf-8')

            # plot2 / liters consumed vs. kilometers traveled

            plt.figure(figsize=(10, 6))

            # bez _ w Kilometers Trabeled - default
            # z _ nowa wersja ktora siem oze nie wywali

            # plt.scatter(df['Kilometers Traveled'], df['Liters'], alpha=0.7, c='g', edgecolors='k', label='Data Points')
            plt.scatter(df['Kilometers_Traveled'], df['Liters'], alpha=0.7, c='g', edgecolors='k', label='Data Points')
            # z = np.polyfit(df['Kilometers Traveled'], df['Liters'], 1)
            z = np.polyfit(df['Kilometers_Traveled'], df['Liters'], 1)
            p = np.poly1d(z)
            # plt.plot(df['Kilometers Traveled'], p(df['Kilometers Traveled']), "r--", label='Trend Line')
            plt.plot(df['Kilometers_Traveled'], p(df['Kilometers_Traveled']), "r--", label='Trend Line')
            plt.title("Liters Consumed vs. Kilometers Traveled", fontsize=16)
            plt.xlabel("Kilometers Traveled", fontsize=14)
            plt.ylabel("Liters Consumed", fontsize=14)
            plt.legend(fontsize=12)
            plt.grid(True)
            plt.tight_layout()
            # bytes / plot2
            img_io = BytesIO()
            plt.savefig(img_io, format='png')
            img_io.seek(0)
            plt.close()
            plot2_image = base64.b64encode(img_io.getvalue()).decode('utf-8')

            # plot 3 / Fuel Price Trends Over Time
            plt.figure(figsize=(14, 7))
            plt.plot(df['Date'], df['Price'], marker='o', label='Fuel Price (per Liter)', color='b')
            plt.title("Fuel Price Over Time", fontsize=16)
            plt.xlabel("Date", fontsize=14)
            plt.ylabel("Fuel Price (PLN per Liter)", fontsize=14)
            plt.legend(fontsize=12)
            plt.xticks(rotation=45)
            plt.tight_layout()
            # bytes / plot3
            img_io = BytesIO()
            plt.savefig(img_io, format='png')
            img_io.seek(0)
            plt.close()
            plot3_image = base64.b64encode(img_io.getvalue()).decode('utf-8')

            # plot 4 / Price per Kilometer
            plt.figure(figsize=(14, 7))
            plt.plot(df['Date'], df['Price per km'], marker='o', label='Price per km', color='purple')
            plt.axhline(y=average_price_per_km, color='r', linestyle='--',
                        label=f'Average Price per km: {average_price_per_km:.2f} PLN')
            plt.title("Price per Kilometer Over Time", fontsize=16)
            plt.xlabel("Date", fontsize=14)
            plt.ylabel("Price per Kilometer (PLN)", fontsize=14)
            plt.legend(fontsize=12)
            plt.xticks(rotation=45)
            plt.tight_layout()
            # bytes / plot4
            img_io = BytesIO()
            plt.savefig(img_io, format='png')
            img_io.seek(0)
            plt.close()
            plot4_image = base64.b64encode(img_io.getvalue()).decode('utf-8')

            # plot5 / Seasonal Comparison of Fuel Consumption and Efficiency
            fig, axes = plt.subplots(1, 2, figsize=(14, 7))
            axes[0].bar(seasonal_analysis['Season'], seasonal_analysis['Fuel consumption (L/100km)'], color='b',alpha=0.7)
            axes[0].set_title("Average Fuel Consumption by Season (L/100km)", fontsize=16)
            axes[0].set_xlabel("Season", fontsize=14)
            axes[0].set_ylabel("Fuel Consumption (L/100km)", fontsize=14)
            axes[1].bar(seasonal_analysis['Season'], seasonal_analysis['Fuel Efficiency (km/L)'], color='g', alpha=0.7)
            axes[1].set_title("Average Fuel Efficiency by Season (km/L)", fontsize=16)
            axes[1].set_xlabel("Season", fontsize=14)
            axes[1].set_ylabel("Fuel Efficiency (km/L)", fontsize=14)
            plt.tight_layout()
            # bytes / plot5
            img_io = BytesIO()
            plt.savefig(img_io, format='png')
            img_io.seek(0)
            plt.close()
            plot5_image = base64.b64encode(img_io.getvalue()).decode('utf-8')

            return Response({
                "analysis": analysis_results,
                "plot1_image": plot1_image,
                "plot2_image": plot2_image,
                "plot3_image": plot3_image,
                "plot4_image": plot4_image,
                "plot5_image": plot5_image,
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)