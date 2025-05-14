import django_filters
from .models import Package

class PackageFilter(django_filters.FilterSet):
    price = django_filters.RangeFilter(field_name="price")
    # user = django_filters.NumberFilter(field_name="user") 

    class Meta:
        model = Package
        # fields = ['price', 'user']
        fields = {
            # price_min / price_max 파라미터로 범위 필터링
            'price': [],
            # user=<id>  OR  user__isnull=<true/false>
            'user': ['exact', 'isnull'],
        }