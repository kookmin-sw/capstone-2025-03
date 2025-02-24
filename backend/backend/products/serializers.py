from rest_framework import serializers
from .models import Product
from categories.models import Category
from django.contrib.auth import get_user_model

User = get_user_model()

class ProductSerializer(serializers.ModelSerializer):
    category_id = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())
    seller_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), allow_null=True)
    buyer_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), allow_null=True, required=False)

    class Meta:
        model = Product
        fields = '__all__' 
