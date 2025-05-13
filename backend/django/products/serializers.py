from rest_framework import serializers
from .models import Product
from categories.models import Category
from users.models import User

class ProductSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())
    category_name = serializers.CharField(source="category.name", read_only=True)
    images = serializers.ListField()
    seller = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=False, allow_null=True)
    buyer = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=False, allow_null=True)
    origin_url  = serializers.URLField(read_only=True)

    class Meta:
        model = Product
        fields = [
            "id", 
            "category", 
            "category_name", 
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
            "sales_status",
            "origin_url"
        ]

class SimpleProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ["id", "name", "price"]
        