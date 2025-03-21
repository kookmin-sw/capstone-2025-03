import django_filters
from .models import Product

class ProductFilter(django_filters.FilterSet):
    seller = django_filters.NumberFilter(field_name="seller", lookup_expr='exact')
    category = django_filters.NumberFilter(field_name="category", lookup_expr='exact')
    sales_status = django_filters.CharFilter(field_name="sales_status", lookup_expr='exact')

    class Meta:
        model = Product
        fields = ['seller', 'category', 'sales_status']
