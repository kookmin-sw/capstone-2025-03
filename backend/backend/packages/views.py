from rest_framework import generics, filters
from .models import Package
from .serializers import PackageSerializer
from .pagination import LargeResultsSetPagination  # 100개씩 페이지네이션 적용

# ✅ 1. 전체 패키지 조회 및 생성 (ListCreateAPIView) + 필터링 & 정렬 & 페이지네이션 적용
class PackageListCreateView(generics.ListCreateAPIView):
    """
    GET: 모든 패키지 조회 (필터링, 정렬, 페이지네이션 포함)
    POST: 새로운 패키지 생성
    """
    queryset = Package.objects.all()
    serializer_class = PackageSerializer
    filter_backends = [filters.OrderingFilter]  # 정렬 기능 추가
    ordering_fields = ['price']  # 가격 정렬 가능
    pagination_class = LargeResultsSetPagination  # 100개씩 페이지네이션 적용

    def get_queryset(self):
        """필터링: industry_id 기준"""
        queryset = Package.objects.all()
        industry_id = self.request.query_params.get('industry_id', None)

        if industry_id:
            queryset = queryset.filter(industry_id=industry_id)

        return queryset.order_by('price')

# ✅ 2. 특정 패키지 조회, 수정, 삭제 (RetrieveUpdateDestroyAPIView)
class PackageDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET: 특정 패키지 조회
    PUT/PATCH: 특정 패키지 수정
    DELETE: 특정 패키지 삭제
    """
    queryset = Package.objects.all()
    serializer_class = PackageSerializer
