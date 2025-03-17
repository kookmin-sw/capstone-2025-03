from rest_framework import serializers
from .models import Package  # 같은 앱의 모델
from categories.models import Category  # 다른 앱의 모델
from products.models import Product  # 다른 앱의 모델

class PackageSerializer(serializers.ModelSerializer):
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), many=True  
    )
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), many=True  \
    )

    class Meta:
        model = Package
        fields = ['id', 'name', 'industry_id', 'category_id', 'product_id']
