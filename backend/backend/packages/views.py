import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import Package

@require_http_methods(["GET"])
def package_list(request):
    """
    GET /packages/
    전체 패키지 목록 조회
    """
    packages = list(Package.objects.values('id', 'name', 'industry_id'))
    return JsonResponse({"packages": packages}, safe=False)

@csrf_exempt
@require_http_methods(["POST"])
def package_create(request):
    """
    POST /packages/add/
    패키지 생성
    요청 body 예시:
    {
        "name": "Starter Package",
        "industry_id": 1
    }
    """
    try:
        data = json.loads(request.body)
        # 필요한 필드 추출
        name = data.get("name")
        industry_id = data.get("industry_id")

        if not name or not industry_id:
            return JsonResponse({"error": "Missing 'name' or 'industry_id'."}, status=400)

        package = Package.objects.create(
            name=name,
            industry_id=industry_id
        )
        return JsonResponse({"message": "Package created", "package_id": package.id}, status=201)

    except json.JSONDecodeError:
        return JsonResponse({"error": "JSON syntax error"}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@require_http_methods(["GET"])
def package_detail(request, pk):
    """
    GET /packages/<pk>/
    단일 패키지 상세 조회
    """
    try:
        package = Package.objects.values('id', 'name', 'industry_id').get(id=pk)
        return JsonResponse(package, safe=False)

    except Package.DoesNotExist:
        return JsonResponse({"error": f"No package with id {pk}"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
@require_http_methods(["PUT"])
def package_update(request, pk):
    """
    PUT /packages/<pk>/update/
    패키지 정보 수정
    요청 body 예시:
    {
        "name": "New Package Name",
        "industry_id": 2
    }
    """
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "JSON syntax error"}, status=400)

    try:
        package = Package.objects.get(id=pk)
        
        updated_fields = []
        if "name" in data and data["name"]:
            package.name = data["name"]
            updated_fields.append("name")

        if "industry_id" in data:
            package.industry_id = data["industry_id"]
            updated_fields.append("industry_id")

        if not updated_fields:
            return JsonResponse({"message": "No changes detected"}, status=400)

        package.save()
        return JsonResponse({"message": "success", "updated_fields": updated_fields}, status=200)

    except Package.DoesNotExist:
        return JsonResponse({"error": f"No package with id {pk}"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
@require_http_methods(["DELETE"])
def package_delete(request, pk):
    """
    DELETE /packages/<pk>/delete/
    패키지 삭제
    """
    try:
        package = Package.objects.get(id=pk)
        package.delete()
        return JsonResponse({"message": "delete success"}, status=200)

    except Package.DoesNotExist:
        return JsonResponse({"error": f"No package with id {pk}"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
