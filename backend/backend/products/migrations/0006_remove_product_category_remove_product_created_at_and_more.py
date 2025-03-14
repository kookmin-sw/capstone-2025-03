# Generated by Django 5.1.5 on 2025-02-25 08:00

import django.contrib.postgres.fields
import django.db.models.deletion
import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        (
            "categories",
            "0002_remove_category_industry_id_category_industry_ids_and_more",
        ),
        ("products", "0005_alter_product_image"),
        ("users", "0004_remove_user_uid_alter_user_address_detail_and_more"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="product",
            name="category",
        ),
        migrations.RemoveField(
            model_name="product",
            name="created_at",
        ),
        migrations.RemoveField(
            model_name="product",
            name="image",
        ),
        migrations.RemoveField(
            model_name="product",
            name="is_sold",
        ),
        migrations.RemoveField(
            model_name="product",
            name="user",
        ),
        migrations.AddField(
            model_name="product",
            name="buyer_id",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="buyer",
                to="users.user",
            ),
        ),
        migrations.AddField(
            model_name="product",
            name="category_id",
            field=models.ForeignKey(
                default=0,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="products",
                to="categories.category",
            ),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="product",
            name="images",
            field=django.contrib.postgres.fields.ArrayField(
                base_field=models.URLField(max_length=255),
                blank=True,
                default=list,
                size=None,
            ),
        ),
        migrations.AddField(
            model_name="product",
            name="purchase_date",
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="product",
            name="sales_status",
            field=models.CharField(default="available", max_length=50),
        ),
        migrations.AddField(
            model_name="product",
            name="seller_id",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="seller",
                to="users.user",
            ),
        ),
        migrations.AddField(
            model_name="product",
            name="upload_date",
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
        migrations.AlterField(
            model_name="product",
            name="grade",
            field=models.CharField(default="B", max_length=50),
        ),
        migrations.AlterField(
            model_name="product",
            name="price",
            field=models.PositiveBigIntegerField(default=0),
        ),
    ]
