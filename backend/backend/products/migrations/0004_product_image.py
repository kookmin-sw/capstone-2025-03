# Generated by Django 5.1.5 on 2025-02-20 09:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0003_alter_product_grade_alter_product_is_sold'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='image',
            field=models.ImageField(default='default.jpg', upload_to='products/'),
        ),
    ]
