from django.db import models
from django.contrib.postgres.fields import ArrayField
from categories.models import Category
from users.models import User
from django.utils import timezone

class Product(models.Model):
    SALES_STATUS_CHOICES = [
        ("sold", "Sold"), # 판매 완료
        ("available", "Available"), # 판매 중
        ("pending", "Pending") # 예약
    ]

    id = models.BigAutoField(primary_key=True)
    
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="products", null=True)
    
    images = ArrayField(base_field=models.URLField(max_length=255), blank=True, default=list, null=True)

    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    grade = models.CharField(max_length=50, default='중고', null=True)
    quantity = models.PositiveIntegerField(default=1, null=True)

    price = models.IntegerField(default=0, null=True)

    seller = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="seller")
    upload_date = models.DateTimeField(default=timezone.now, null=True)

    buyer = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="buyer")
    purchase_date = models.DateTimeField(blank=True, null=True)

    sales_status = models.CharField(max_length=50, choices=SALES_STATUS_CHOICES, default="available", null=True)
    # 판매 상태 (판매 중, 판매 완료, 예약 중)
    # available: 판매 중
    # sold: 판매 완료
    # pending: 예약 중

    def __str__(self):
        """제품명과 가격, 판매 상태를 함께 출력"""
        return f"{self.name} - {self.price}원 ({self.sales_status})"
