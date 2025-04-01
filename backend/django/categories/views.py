from rest_framework import generics
from .models import Category
from .serializers import CategorySerializer

# ✅ [GET, POST] 카테고리 목록 조회 & 생성 (List & Create)
class CategoryListCreateView(generics.ListCreateAPIView):
    serializer_class = CategorySerializer
    
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
