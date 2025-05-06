from rest_framework import serializers
from products.serializers import ProductSerializer
from categories.models import Category
from industries.models import Industry
from .models import Package

class PackageSerializer(serializers.ModelSerializer):
    categories = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), many=True)
    products = ProductSerializer(many=True, read_only=True)
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
