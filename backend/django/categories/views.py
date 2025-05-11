from rest_framework import generics
from .models import Category
from .serializers import CategorySerializer

# ✅ [GET, POST] 카테고리 목록 조회 & 생성 (List & Create)
class CategoryListCreateView(generics.ListCreateAPIView):
    serializer_class = CategorySerializer

    def get_queryset(self):
        # 🔥 N+1 문제 방지: industries 미리 불러오기
        queryset = Category.objects.all().prefetch_related('industries')
        
        industries = self.request.query_params.get("industry_id", None)
        if industries:
            industries = [int(i) for i in industries.split(",")]
            for industry_id in industries:
                queryset = queryset.filter(industries__id=industry_id)

        return queryset

# ✅ [GET, PUT, DELETE] 단일 카테고리 조회/수정/삭제
class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all().prefetch_related('industries')
    serializer_class = CategorySerializer
