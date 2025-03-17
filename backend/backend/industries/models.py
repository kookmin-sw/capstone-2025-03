from django.db import models

class Industry(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, unique=True)
    icon = models.ImageField(blank=True, null=True)

    def __str__(self):
        return self.name
