from rest_framework import serializers
from .models import Product
from categories.models import Category
from users.models import User

class ProductSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())
    seller = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    buyer = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=False, allow_null=True)

    class Meta:
        model = Product
        fields = [
            "id", 
            "category", 
            "images", 
            "name", 
            "description", 
            "grade", 
            "quantity", 
            "price", 
            "seller", 
            "upload_date", 
            "buyer", 
            "purchase_date", 
            "sales_status"
        ]

class SimpleProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ["id", "name", "price"]
        