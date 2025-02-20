from django.http import JsonResponse
from .models import Industry

def industry_list(request):
    """업종 리스트 조회 API"""
    industries = list(Industry.objects.values('id', 'name'))
    return JsonResponse({"industries": industries})
