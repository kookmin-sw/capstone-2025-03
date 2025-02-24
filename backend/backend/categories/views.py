from rest_framework import generics
from rest_framework.filters import OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from categories.models import Category
from categories.serializers import CategorySerializer

# ✅ [POST] 카테고리 생성 (Create)
class CategoryCreateView(generics.CreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    
   
class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    # ✅ 필터링 & 정렬 추가
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ["industry_ids"]  # industry_id 기준 필터링
    ordering_fields = ["name"]  # name 기준 정렬 (기본값: 오름차순)


# ✅ [GET, PUT, DELETE] 단일 카테고리 조회/수정/삭제 (Retrieve, Update, Delete)
class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

