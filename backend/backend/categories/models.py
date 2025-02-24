from django.db import models
from industries.models import Industry

class Category(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    thumbnail = models.URLField(blank=True, null=True)
    industry_ids = models.ManyToManyField(Industry, related_name="categories")
    
    def __str__(self):
        return self.name
