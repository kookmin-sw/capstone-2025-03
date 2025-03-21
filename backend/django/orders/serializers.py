from rest_framework import serializers
from .models import Order
from users.models import User
from packages.models import Package

class OrderSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    package = serializers.PrimaryKeyRelatedField(queryset=Package.objects.all())

    class Meta:
        model = Order
        fields = [
            "id",
            "user",
            "package",
            "created_at"
        ]
