from django.db import models
# from industries.models import Industry
from categories.models import Category
from django.contrib.auth import get_user_model

User = get_user_model()

class Product(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    # industry = models.ForeignKey(Industry, on_delete=models.SET_NULL, null=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    # user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='products_user')
    user = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='products_user')
    grade = models.CharField(max_length=1, default='B')
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_sold = models.CharField(max_length=10, default='selling')
    image = models.ImageField(upload_to='products/', default='default.jpg', blank=True, null=True)

    def __str__(self):
        return self.name
