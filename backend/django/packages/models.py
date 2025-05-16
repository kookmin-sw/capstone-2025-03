from django.db import models
from industries.models import Industry
from categories.models import Category
from products.models import Product
from users.models import User

class Package(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    thumbnail = models.URLField(max_length=255, blank=True, null=True)
    
    industry = models.ForeignKey(Industry, on_delete=models.CASCADE, blank=True, null=True)
    categories = models.ManyToManyField(Category, related_name="packages_categories", blank=True)
    products = models.ManyToManyField(Product, related_name="package_products", blank=True)
    
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="custom_packages")
    price = models.PositiveBigIntegerField(default=0, blank=True, null=True)
    
    

    def __str__(self):
        return self.name
