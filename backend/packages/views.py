from django.http import JsonResponse
from .models import Package

def package_list(request):
    """추천 패키지 리스트 조회 API"""
    packages = list(Package.objects.values('id', 'name', 'industry_id'))
    return JsonResponse({"packages": packages})
