from django.db import models
from django.contrib.postgres.fields import ArrayField
from categories.models import Category
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()

class Product(models.Model):
    id = models.AutoField(primary_key=True)
    category_id = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="products")
    images = ArrayField(
        base_field=models.URLField(max_length=255),
        blank=True,
        default=list
    )
    
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    grade = models.CharField(max_length=50, default='B')
    quantity = models.PositiveIntegerField(default=1)
    price = models.PositiveBigIntegerField(default=0)

    seller_id = models.ForeignKey('User', on_delete=models.SET_NULL, null=True, related_name="seller")
    upload_date = models.DateTimeField(default=timezone.now)
    
    buyer_id = models.ForeignKey('User', on_delete=models.SET_NULL, null=True, blank=True, related_name="buyer")
    purchase_date = models.DateTimeField(blank=True, null=True)
    
    sales_status = models.CharField(max_length=50, default="available")

    def __str__(self):
        return self.name
