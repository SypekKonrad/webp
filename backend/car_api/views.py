from rest_framework import status, generics
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import CarSerializer, RatingSerializer
from .models import Car, Rating
import requests
from django.db.models import Avg, Count

class Cars(APIView):

    def post(self, request):
        make = request.data.get('make')
        model = request.data.get('model')
        serializer = CarSerializer(data={'make': make, 'model': model})
        #print(request.data)

        url = f"https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/{make}?format=json"

        response = requests.get(url)

        if response.status_code == 200:
            data = response.json()
            results = data.get('Results', [])
            car_exists = any(
                result['Make_Name'] == make and result['Model_Name'] == model for result
                in results)

            if Car.objects.filter(make=make, model=model).exists():
                return Response({'error': 'Car already exists'}, status=status.HTTP_400_BAD_REQUEST)

            if car_exists:
                serializer = CarSerializer(data={'make': make, 'model': model})

                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_201_CREATED)

                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            else:
                return Response({'error': f'No records found for {make} {model}'}, status=status.HTTP_404_NOT_FOUND)

        else:
            return Response({'error': 'Failed to retrieve data from external API'}, status=response.status_code)

    def get(self, request):

        cars = Car.objects.all()

        for car in cars:
            car.average_rating = Rating.objects.filter(car=car).aggregate(Avg('rating'))['rating__avg']
            if car.average_rating is not None:
                car.average_rating = round(car.average_rating, 2)

        serializer = CarSerializer(cars, many=True)
        return Response(serializer.data)



@api_view(['POST'])
def rate(request):
    car = request.data.get('car')
    rating = request.data.get('rating')
    serializer = RatingSerializer(data={'car': car, 'rating': rating})

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class Popular(generics.ListAPIView):
    queryset = Car.objects.annotate(num_ratings=Count('ratings')).order_by('-num_ratings')
    serializer_class = CarSerializer


# {
#     "car": 4,
#     "rating": 4
# }