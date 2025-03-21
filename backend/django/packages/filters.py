import django_filters
from .models import Package

class PackageFilter(django_filters.FilterSet):
    price = django_filters.RangeFilter(field_name="price")

    class Meta:
        model = Package
        fields = ['price']
