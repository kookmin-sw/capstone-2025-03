from django.db import models
from django.utils import timezone

class User(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    profile_image = models.CharField(blank=True, null=True)
    kakao_email = models.CharField(unique=True, default=None)
    phone_number = models.CharField(max_length=13, blank=True, null=True) # 010-1234-5678 (13자리)
    birth_date = models.DateField(blank=True, null=True)
    full_address = models.CharField(blank=True, null=True)
    address_detail = models.CharField(blank=True, null=True)
    create_date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.name