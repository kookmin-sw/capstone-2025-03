from rest_framework import generics
from rest_framework.filters import OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from categories.models import Category
from categories.serializers import CategorySerializer

# ✅ [POST] 카테고리 생성 (Create)
class CategoryCreateView(generics.CreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

# ✅ [GET] 카테고리 목록 조회 (List)
class CategoryListView(generics.ListAPIView):
    serializer_class = CategorySerializer
    filter_backends = [OrderingFilter]
    ordering_fields = ["name"]  # name 기준 정렬 (기본값: 오름차순)

    def get_queryset(self):
        queryset = Category.objects.all()
        industry_id = self.request.query_params.get("industry_id", None)

        if industry_id:
            queryset = queryset.filter(industry_ids__id=industry_id).distinct()  

        return queryset

# ✅ [GET, PUT, DELETE] 단일 카테고리 조회/수정/삭제 (Retrieve, Update, Delete)
class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
