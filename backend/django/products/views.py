from rest_framework import generics, filters, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.utils import timezone
from .models import Category, Product, User
from .serializers import ProductSerializer
from categories.serializers import CategorySerializer
from .pagination import LargeResultsSetPagination
from django_filters.rest_framework import DjangoFilterBackend
from .filters import ProductFilter

# ✅ 1. 전체 상품 조회 및 생성 (ListCreateAPIView)
class ProductListCreateView(generics.ListCreateAPIView):
    queryset = Product.objects.all().order_by('sales_status', 'price')
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_class = ProductFilter
    ordering_fields = ['sales_status', 'price', 'upload_date']
    pagination_class = LargeResultsSetPagination

    def get_queryset(self):
        queryset = Product.objects.all().order_by('sales_status', 'price')

        # 필터링 파라미터 가져오기
        seller = self.request.query_params.get('seller', None)
        category = self.request.query_params.get('category', None)
        sales_status = self.request.query_params.get('sales_status', None)

        # ✅ 특정 판매자의 상품만 조회하도록 필터링 추가
        if seller:
            queryset = queryset.filter(seller=seller)
        if category:
            queryset = queryset.filter(category=category)
        if sales_status:
            queryset = queryset.filter(sales_status=sales_status)

        return queryset

# ✅ 2. 특정 상품 조회, 수정, 판매 완료 처리 가능 (RetrieveUpdateDestroyAPIView)
class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer