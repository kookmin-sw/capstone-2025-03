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
import requests

# 🔹 FastAPI 이미지 삭제 API 주소
FASTAPI_DELETE_URL = "https://image-535482967924.asia-northeast1.run.app/delete-images/"

# ✅ 상품 리스트 조회 및 등록
class ProductListCreateView(generics.ListCreateAPIView):
    queryset = Product.objects.all().order_by('sales_status', 'price')
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_class = ProductFilter
    ordering_fields = ['price', 'upload_date']
    pagination_class = LargeResultsSetPagination

    def get_queryset(self):
        queryset = Product.objects.all()
        seller = self.request.query_params.get('seller')
        category = self.request.query_params.get('category')
        sales_status = self.request.query_params.get('sales_status')

        if seller:
            queryset = queryset.filter(seller=seller)
        if category:
            queryset = queryset.filter(category=category)
        if sales_status:
            queryset = queryset.filter(sales_status=sales_status)

        return queryset

    def perform_create(self, serializer):
        return serializer.save()

# ✅ 상품 조회, 수정, 삭제
class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def perform_update(self, serializer):
        return serializer.save()

    def perform_destroy(self, instance):
        image_urls = instance.images or []
        gcs_file_names = []

        for url in image_urls:
            if "storage.googleapis.com/restart-images" in url:
                file_name = url.split("restart-images/")[-1]
                gcs_file_names.append(file_name)

        if gcs_file_names:
            try:
                requests.post(FASTAPI_DELETE_URL, json={"file_names": gcs_file_names})
            except Exception as e:
                print(f"[경고] 이미지 다건 삭제 실패: {str(e)}")

        instance.delete()