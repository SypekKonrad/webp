from rest_framework import status
from unittest.mock import patch
from .models import Car, Rating
from rest_framework.test import APITestCase


class CarsTestCase(APITestCase):

    @patch('requests.get')
    def test_cars_post_success(self, mock_get):
        mock_get.return_value.status_code = 200
        mock_get.return_value.json.return_value = {
            'Results': [{'Make_Name': 'Toyota', 'Model_Name': 'Prius'}]
        }

        response = self.client.post('/car_api/cars/', {'make': 'Toyota', 'model': 'Prius'})

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Car.objects.filter(make='Toyota', model='Prius').exists())

    @patch('requests.get')
    def test_cars_post_duplicate(self, mock_get):
        existing_car = Car.objects.create(make='Toyota', model='Prius')

        mock_get.return_value.status_code = 200
        mock_get.return_value.json.return_value = {
            'Results': [{'Make_Name': 'Toyota', 'Model_Name': 'Prius'}]
        }

        response = self.client.post('/car_api/cars/', {'make': 'Toyota', 'model': 'Prius'})

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], 'Car already exists')

    @patch('requests.get')
    def test_cars_post_failure_nonexistent_car(self, mock_get):
        mock_get.return_value.status_code = 200
        mock_get.return_value.json.return_value = {'Results': []}

        response = self.client.post('/car_api/cars/', {'make': 'FSO', 'model': 'Polonez'})

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertFalse(Car.objects.filter(make='FSO', model='Polonez').exists())

    @patch('requests.get')
    def test_cars_post_failure_external_api(self, mock_get):
        mock_get.return_value.status_code = 500

        response = self.client.post('/car_api/cars/', {'make': 'Toyota', 'model': 'Prius'})

        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
    def test_cars_get_success(self):
        car1 = Car.objects.create(make="Toyota", model="Prius")
        car2 = Car.objects.create(make="Toyota", model="Camry")
        Rating.objects.create(car=car1, rating=4)
        Rating.objects.create(car=car1, rating=5)
        Rating.objects.create(car=car2, rating=3)

        response = self.client.get('/car_api/cars/')


        self.assertEqual(response.status_code, status.HTTP_200_OK)

        expected_data = [
            {'id': car1.id, 'make': car1.make, 'model': car1.model, 'average_rating': 4.5},
            {'id': car2.id, 'make': car2.make, 'model': car2.model, 'average_rating': 3.0}
        ]
        self.assertEqual(response.data, expected_data)

class RateTestCase(APITestCase):

    def test_rate_valid_data(self):
        car = Car.objects.create(make='Toyota', model='Prius')
        valid_data = {'car': car.id, 'rating': 5}

        response = self.client.post('/car_api/rate/', valid_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Rating.objects.filter(car=car.id).exists())

    def test_rate_invalid_data(self):
        invalid_data = {'car': 1}

        response = self.client.post('/car_api/rate/', invalid_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('rating', response.data)

class PopularTestCase(APITestCase):

    def test_popular_get_success(self):
        toyota_camry = Car.objects.create(make='Toyota', model='Camry')
        toyota_avalon = Car.objects.create(make='Toyota', model='Avalon')
        toyota_prius = Car.objects.create(make='Toyota', model='Prius')

        Rating.objects.create(car=toyota_avalon, rating=4)

        for i in range(2):
            Rating.objects.create(car=toyota_camry, rating=5)

        response = self.client.get('/car_api/cars/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()

        self.assertEqual(len(data), 3)

        expected_car_data = [
            ('Toyota', 'Camry'),
            ('Toyota', 'Avalon'),
            ('Toyota', 'Prius')
        ]

        for i, (expected_make, expected_model) in enumerate(expected_car_data):
            self.assertEqual(data[i]['make'], expected_make)
            self.assertEqual(data[i]['model'], expected_model)

        num_ratings_camry = Rating.objects.filter(car=toyota_camry).count()
        num_ratings_avalon = Rating.objects.filter(car=toyota_avalon).count()
        num_ratings_prius = Rating.objects.filter(car=toyota_prius).count()

        self.assertEqual(num_ratings_camry, 2)
        self.assertEqual(num_ratings_avalon, 1)
        self.assertEqual(num_ratings_prius, 0)