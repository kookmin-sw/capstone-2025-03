from django.db import models
from industries.models import Industry

class Category(models.Model):
    id = models.AutoField(primary_key=True) # 아이디
    name = models.CharField(max_length=100, unique=True) # 카테고리 이름
    thumbnail = models.URLField(blank=True, null=True) # 카테고리 썸네일
    industries = models.ManyToManyField(Industry, related_name="categories") # 카테고리 - 인더스트리
    
    def __str__(self):
        return self.name