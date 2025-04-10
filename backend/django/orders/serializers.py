from rest_framework import serializers
from .models import Order
from users.models import User
from packages.models import Product
from products.serializers import SimpleProductSerializer


class OrderSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    products = SimpleProductSerializer(many=True)
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            "id",
            "user",
            "products",
            "total_price",
            "created_at",
        ]

    def get_total_price(self, obj):
        return sum(product.price for product in obj.products.all())

    # def get_products(self, obj):
    #     return list(obj.products.values_list("id", flat=True))