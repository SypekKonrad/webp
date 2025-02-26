from django.db import models

class Car(models.Model):
    make = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.make} {self.model}"

class Rating(models.Model):
    car = models.ForeignKey(Car, on_delete=models.CASCADE, related_name='ratings')
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])

    def __str__(self):
        return f"Rating {self.rating} for {self.car}"