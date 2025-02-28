from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'  # 모든 필드 포함
        extra_kwargs = {
            'kakao_email': {'required': True},
        }
