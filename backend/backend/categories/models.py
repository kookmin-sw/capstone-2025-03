from django.db import models
from industries.models import Industry

class Category(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    industry_id = models.ManyToManyField(Industry)

    def __str__(self):
        return self.name
