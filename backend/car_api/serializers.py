from rest_framework import serializers
from .models import Car, Rating

class CarSerializer(serializers.ModelSerializer):
    average_rating = serializers.FloatField(required=False)
    class Meta:
        model = Car
        fields = ['id', 'make', 'model', 'average_rating']

class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = ['id', 'car', 'rating']