from django.urls import path
from .views import GetCarData, AnalyzeCarData

urlpatterns = [
    path('get_car_data/', GetCarData.as_view(), name='get_car_data'),
    path('analyze_car_data/', AnalyzeCarData.as_view(), name='get_car_data'),
]