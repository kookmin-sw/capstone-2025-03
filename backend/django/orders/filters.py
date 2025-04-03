import django_filters
from .models import Order

class OrderFilter(django_filters.FilterSet):
    user = django_filters.NumberFilter(field_name="user", lookup_expr='exact')  # 구매자 ID
    payment_status = django_filters.CharFilter(field_name="payment_status", lookup_expr='exact')  # 결제 상태
    created_at = django_filters.DateFromToRangeFilter(field_name="created_at")  # 날짜 범위 필터링

    class Meta:
        model = Order
        fields = ['user', 'payment_status', 'created_at']
