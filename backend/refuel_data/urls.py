from django.urls import path
from .views import GetCarData

urlpatterns = [
    path('get_car_data/', GetCarData.as_view(), name='get_car_data'),
]