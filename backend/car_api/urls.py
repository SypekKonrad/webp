from django.urls import path
from .views import Cars, rate, Popular

urlpatterns = [
    path('cars/', Cars.as_view(), name='cars'),
    path('rate/', rate, name='rate'),
    path('popular/', Popular.as_view(), name='popular_car_list'),
]