from rest_framework import generics, filters, status
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page

from .models import Package
from .serializers import PackageSerializer
from .pagination import LargeResultsSetPagination
from .filters import PackageFilter


@method_decorator(cache_page(60 * 5), name='get')  # 캐시: 리스트 조회 5분
class PackageListCreateView(generics.ListCreateAPIView):
    serializer_class = PackageSerializer
    filter_backends = [filters.OrderingFilter, DjangoFilterBackend]
    filterset_class = PackageFilter
    ordering_fields = ['price']
    pagination_class = LargeResultsSetPagination

    def get_queryset(self):
        queryset = (
            Package.objects
                   .select_related('industry', 'user')
                   .prefetch_related('categories', 'products')
        )
        industry = self.request.query_params.get('industry', None)
        if industry:
            queryset = queryset.filter(industry=industry)
        return queryset.order_by('price')


@method_decorator(cache_page(60 * 10), name='get')  # 캐시: 상세 조회 10분
class PackageDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = (
        Package.objects
               .select_related('industry', 'user')
               .prefetch_related('categories', 'products')
    )
    serializer_class = PackageSerializer