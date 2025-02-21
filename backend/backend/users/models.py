from django.contrib.auth.models import AbstractUser
from django.db import models
from PIL import Image

class User(models.Model):
    uid = models.CharField(max_length=100, unique=True, null=True)
    name = models.CharField(max_length=100, null=True)
    kakao_email = models.EmailField(unique=True, null=True)
    phone_number = models.CharField(max_length=20, null=True)
    birth_date = models.DateField(null=True)
    full_address = models.TextField(null=True)
    address_detail = models.TextField(null=True)
    create_date = models.DateTimeField(auto_now_add=True, null=True)
    profile_image = models.URLField(blank=True, null=True, default="https://www.animaltoc.com/news/articleView.html?idxno=1409")
    
    # def save(self, *args, **kwargs):
    #     super().save(*args, **kwargs)
    #     if self.profile_image.height > 300 or self.profile_image.width > 300:
    #         img = Image.open(self.profile_image.path)
    #         output_size = (300, 300)
    #         img.thumbnail(output_size)
    #         img.save(self.profile_image.path)

    def __str__(self):
        return self.name
