from django.db import models
from users.models import User
from packages.models import Package

class Order(models.Model):
    # PAYMENT_STATUS_CHOICES = [
    #     ("pending", "Pending"),
    #     ("paid", "Paid"),
    #     ("canceled", "Canceled")
    # ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    package = models.ForeignKey(Package, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    # payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default="pending")

    def __str__(self):
        return f"Order {self.id} - {self.user.id} - {self.package.name}"
        # return f"Order {self.id} - {self.user.id} - {self.package.name} ({self.payment_status})"
