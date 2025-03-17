from rest_framework import generics
from industries.models import Industry
from industries.serializers import IndustrySerializer

# ✅ [POST] 업종 생성 (Create)
class IndustryCreateView(generics.CreateAPIView):
    queryset = Industry.objects.all()
    serializer_class = IndustrySerializer

# ✅ [GET, PUT, DELETE] 단일 업종 조회/수정/삭제 (Retrieve, Update, Delete)
class IndustryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Industry.objects.all()
    serializer_class = IndustrySerializer
