from rest_framework import generics
from .models import Industry
from .serializers import IndustrySerializer

# ✅ [GET, POST] 업종 목록 조회 및 생성 (List & Create)
class IndustryListCreateView(generics.ListCreateAPIView):
    queryset = Industry.objects.all().prefetch_related('categories').order_by('id')  # 🔥 N+1 방지
    serializer_class = IndustrySerializer

# ✅ [GET, PUT, DELETE] 단일 업종 조회/수정/삭제
class IndustryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Industry.objects.all().prefetch_related('categories')  # 🔥 N+1 방지
    serializer_class = IndustrySerializer
