from rest_framework import serializers
from users.models import User
from categories.models import Category
from industries.models import Industry
from .models import Package
from products.serializers import ProductSerializer

class PackageSerializer(serializers.ModelSerializer):
    # 읽기 전용 nested
    products = ProductSerializer(many=True, read_only=True)

    # 쓰기 전용 PK 리스트
    product_ids = serializers.PrimaryKeyRelatedField(many=True, queryset=ProductSerializer.Meta.model.objects.all(), write_only=True, source='products')
    categories = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), many=True)
    industry   = serializers.PrimaryKeyRelatedField(queryset=Industry.objects.all(), required=False, allow_null=True)
    user       = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())

    class Meta:
        model = Package
        fields = [
            "id", "name", "description", "thumbnail",
            "industry", "categories",
            "products",    # GET용
            "product_ids", # POST/PUT용
            "price", "user"
        ]
