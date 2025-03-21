from rest_framework import generics
from rest_framework.filters import OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category
from .serializers import CategorySerializer

# ✅ [GET, POST] 카테고리 목록 조회 & 생성 (List & Create)
class CategoryListCreateView(generics.ListCreateAPIView):
    serializer_class = CategorySerializer
    filter_backends = [OrderingFilter]
    ordering_fields = ["name"]  # name 기준 정렬 (기본값: 오름차순)

#     업종 단일 필터링 코드
#     def get_queryset(self):
#         queryset = Category.objects.all()
#         industry = self.request.query_params.get("industry_id", None)

#         if industry:
#             queryset = queryset.filter(industries__id=industry).distinct()
            
    
    def get_queryset(self):
        queryset = Category.objects.all()
        industries = self.request.query_params.get("industry_id", None)

        if industries:
            industries = industries.split(",")  
            industries = [int(i) for i in industries]

            for industry_id in industries:
                queryset = queryset.filter(industries__id=industry_id)

        return queryset

# ✅ [GET, PUT, DELETE] 단일 카테고리 조회/수정/삭제 
class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
