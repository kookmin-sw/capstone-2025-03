from django.http import JsonResponse
from .models import Category

def category_list(request):
    """카테고리 리스트 조회 API"""
    categories = list(Category.objects.values('id', 'name', 'industry_id'))
    return JsonResponse({"categories": categories})
