from django.http import JsonResponse, HttpResponseNotAllowed
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import Category
import json


@csrf_exempt
@require_http_methods(["POST"]) #create
def category_create(request):
    data = json.loads(request.body)
    category = Category.objects.create(name=data['name'], industry_id=data['industry_id'])
    return JsonResponse({"id": category.id, "name": category.name, "industry_id": category.industry_id})

@require_http_methods(["GET"]) #read
def category_list(request):
    categories = list(Category.objects.values('id', 'name', 'industry_id'))
    return JsonResponse({"categories": categories})

@csrf_exempt
@require_http_methods(["PUT"]) #update
def category_update(request, category_id):
    data = json.loads(request.body)
    try:
        category = Category.objects.get(id=category_id)
        category.name = data['name']
        category.industry_id = data['industry_id']
        category.save()
        return JsonResponse({"id": category.id, "name": category.name, "industry_id": category.industry_id})
    except Category.DoesNotExist:
        return JsonResponse({"error": "Category not found"}, status=404)

@csrf_exempt
@require_http_methods(["DELETE"]) #delete
def category_delete(request, category_id):
    try:
        category = Category.objects.get(id=category_id)
        category.delete()
        return JsonResponse({"message": "Category deleted"})
    except Category.DoesNotExist:
        return JsonResponse({"error": "Category not found"}, status=404)
