from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
                  "id", 
                  "kakao_id", 
                  "name", 
                  "profile_image", 
                  "kakao_email", 
                  "phone_number", 
                  "birth_date", 
                  "full_address", 
                  "address_detail", 
                  "create_date"
                  ] 