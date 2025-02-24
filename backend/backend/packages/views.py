from rest_framework import generics
from .models import Package
from .serializers import PackageSerializer

class PackageListCreateView(generics.ListCreateAPIView):
    """
    GET: 모든 패키지 조회
    POST: 새로운 패키지 생성
    """
    queryset = Package.objects.all()
    serializer_class = PackageSerializer


class PackageDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET: 특정 패키지 조회
    PUT/PATCH: 특정 패키지 수정
    DELETE: 특정 패키지 삭제
    """
    queryset = Package.objects.all()
    serializer_class = PackageSerializer
