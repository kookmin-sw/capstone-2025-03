from rest_framework import serializers
from industries.models import Industry
from categories.models import Category
from products.models import Product

class CategorySerializer(serializers.ModelSerializer):
    industries = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Industry.objects.all() 
    )

    class Meta:
        model = Category
        fields = ["id", "name", "thumbnail", "industries"]  # industries 필드 포함

class PreviewItemSerializer(serializers.Serializer):
    id        = serializers.IntegerField()
    name      = serializers.CharField()
    grade     = serializers.CharField()
    price     = serializers.IntegerField()      # 가격 추가
    thumbnail = serializers.URLField(allow_null=True)

class PreviewCategorySerializer(serializers.Serializer):
    id    = serializers.IntegerField()
    name  = serializers.CharField()
    items = PreviewItemSerializer(many=True)

class ProductPreviewSerializer(serializers.Serializer):
    id        = serializers.IntegerField()
    name      = serializers.CharField()
    grade     = serializers.CharField()
    price     = serializers.IntegerField()
    thumbnail = serializers.URLField(allow_null=True)