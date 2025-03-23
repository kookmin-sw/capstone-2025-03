from rest_framework import serializers
from .models import Package
from categories.models import Category
from products.models import Product
from industries.models import Industry

class PackageSerializer(serializers.ModelSerializer):
    categories = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), many=True)
    products = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all(), many=True)
    industry = serializers.PrimaryKeyRelatedField(queryset=Industry.objects.all())

    class Meta:
        model = Package
        fields = [
            "id",
            "name",
            "description",
            "thumbnail",
            "industry",
            "categories",
            "products",
            "price"
        ]