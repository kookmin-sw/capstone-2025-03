from rest_framework import generics, filters, status
from rest_framework.response import Response
from .models import Package
from .serializers import PackageSerializer
from .pagination import LargeResultsSetPagination
from django_filters.rest_framework import DjangoFilterBackend
from .filters import PackageFilter

# ✅ 1. 전체 패키지 조회 및 생성 (ListCreateAPIView)
class PackageListCreateView(generics.ListCreateAPIView):
    queryset = Package.objects.all()
    serializer_class = PackageSerializer
    filter_backends = [filters.OrderingFilter, DjangoFilterBackend]
    filterset_class = PackageFilter
    ordering_fields = ['price']
    pagination_class = LargeResultsSetPagination  

    def get_queryset(self):
        queryset = Package.objects.all()

        industry = self.request.query_params.get('industry', None)

        if industry:
            queryset = queryset.filter(industry=industry)

        return queryset.order_by('price')

# ✅ 2. 특정 패키지 조회, 수정, 삭제 가능 (RetrieveUpdateDestroyAPIView)
class PackageDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Package.objects.all()
    serializer_class = PackageSerializer