from django.db import models
from django.utils import timezone

class User(models.Model):
    """ 유저 정보 모델 """
    
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    profile_image = models.CharField(max_length=255, blank=True, null=True)
    kakao_email = models.CharField(max_length=255, unique=True)
    phone_number = models.CharField(max_length=11, blank=True, null=True)
    birth_date = models.DateField(blank=True, null=True)
    full_address = models.CharField(max_length=255, blank=True, null=True)
    address_detail = models.CharField(max_length=255, blank=True, null=True)
    create_date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.id} - {self.name}"

