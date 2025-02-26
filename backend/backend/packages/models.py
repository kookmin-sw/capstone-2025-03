from django.db import models
from industries.models import Industry
from categories.models import Category
from products.models import Product

class Package(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    industry_id = models.ForeignKey(Industry, on_delete=models.CASCADE)
    category_id = models.ManyToManyField(Category, related_name="packages_categories")
    product_id = models.ManyToManyField(Product, related_name="package_products")
    price = models.PositiveBigIntegerField(default=0)

    def __str__(self):
        return self.name
