from rest_framework import serializers

class CarDataSerializer(serializers.Serializer):
    Date = serializers.CharField(max_length=100)
    Price = serializers.CharField(max_length=100)
    Kilometers_Traveled = serializers.CharField(max_length=100)
    Liters = serializers.CharField(max_length=100)