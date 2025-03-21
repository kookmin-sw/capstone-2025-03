from rest_framework import serializers
from industries.models import Industry
from categories.models import Category

class CategorySerializer(serializers.ModelSerializer):
    industries = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Industry.objects.all() 
    )

    class Meta:
        model = Category
        fields = ["id", "name", "thumbnail", "industries"]  # industries 필드 포함
