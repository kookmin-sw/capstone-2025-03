from django.db import models
from industries.models import Industry
from categories.models import Category
from products.models import Product  # ✅ 기존 Product 모델을 가져옴

class Package(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    industry = models.ForeignKey(Industry, on_delete=models.CASCADE)
    category_id = models.ManyToManyField(Category, related_name="packages_categories")  # ✅ related_name 추가
    product_id = models.ManyToManyField(Product, related_name="package_products")  # ✅ 다대다 관계 추가

    def __str__(self):
        return self.name
