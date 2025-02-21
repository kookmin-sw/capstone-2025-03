from django.http import JsonResponse, HttpResponseNotAllowed
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import Industry
import json


@csrf_exempt
@require_http_methods(["POST"]) #create
def industry_create(request):
    data = json.loads(request.body)
    industry = Industry.objects.create(name=data['name'])
    return JsonResponse({"id": industry.id, "name": industry.name})

def industry_list(request): #read
    industries = list(Industry.objects.values('id', 'name'))
    return JsonResponse({"industries": industries})

@csrf_exempt
@require_http_methods(["PUT"]) #update
def industry_update(request, industry_id):
    data = json.loads(request.body)
    try:
        industry = Industry.objects.get(id=industry_id)
        industry.name = data['name']
        industry.save()
        return JsonResponse({"id": industry.id, "name": industry.name})
    except Industry.DoesNotExist:
        return JsonResponse({"error": "Industry not found"}, status=404)

@csrf_exempt
@require_http_methods(["DELETE"]) #delete
def industry_delete(request, industry_id):
    try:
        industry = Industry.objects.get(id=industry_id)
        industry.delete()
        return JsonResponse({"message": "Industry deleted"})
    except Industry.DoesNotExist:
        return JsonResponse({"error": "Industry not found"}, status=404)
