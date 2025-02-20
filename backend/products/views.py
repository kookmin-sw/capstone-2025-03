import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from users.models import User  # ✅ users_user 테이블을 직접 참조
from products.models import Product  # ✅ Product 모델 import
from categories.models import Category  # ✅ Category 모델 import
from django.shortcuts import render, redirect
from .forms import ProductForm

@csrf_exempt
@require_http_methods(["POST"])
def add_product(request):
    """유저가 새로운 제품을 추가"""

    try:
        # 🔹 요청 데이터를 JSON으로 변환
        data = json.loads(request.body.decode("utf-8"))  
        user_id = data.get("user_id")  
        category_id = data.get("category_id")  # ✅ category_id 추가

        print(f"✅ user_id: {user_id}, category_id: {category_id}")  # 디버깅용 로그 추가

        # 🔹 users_user 테이블에서 유저 검색
        user = User.objects.get(id=user_id)
        
        # 🔹 categories 테이블에서 카테고리 검색
        category = Category.objects.get(id=category_id)

        # ✅ 제품 생성 및 저장
        product = Product.objects.create(
            user=user,
            category=category,  # ✅ category_id 추가
            name=data.get("name"),
            description=data.get("description", ""),
            grade=data.get("grade"),
            quantity=data.get("quantity"),
            price=data.get("price"),
            is_sold=False  # 기본값 설정
        )
        product.save()  # ✅ 명시적으로 저장 호출
        print(f"✅ saved: {product.id}")  # 저장된 제품 ID 출력

    except json.JSONDecodeError:
        return JsonResponse({"error": "JSON syntax error"}, status=400)

    except User.DoesNotExist:
        return JsonResponse({"error": f"no user_id {user_id}"}, status=404)

    except Category.DoesNotExist:
        return JsonResponse({"error": f"no category_id {category_id}"}, status=404)

    return JsonResponse({"message": "add success", "product_id": product.id}, status=201)


@require_http_methods(["GET"])
def get_user_products(request, user_id):
    """유저가 등록한 제품 조회"""
    products = Product.objects.filter(user_id=user_id).values(  # ✅ 필드명 수정
        "id", "name", "description", "grade", "quantity", "price", "is_sold", "created_at"
    )

    if not products:
        return JsonResponse({"message": "no product"}, status=200)

    return JsonResponse(list(products), safe=False, json_dumps_params={'indent':4})

@csrf_exempt
@require_http_methods(["PUT"])
def update_product(request, product_id):
    """유저가 등록한 제품을 수정"""
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "JSON syntax error"}, status=400)

    try:
        product = Product.objects.get(id=product_id)

        updated_fields = []
        if "name" in data and data["name"]:
            product.name = data["name"]
            updated_fields.append("name")
        if "description" in data:
            product.description = data["description"]
            updated_fields.append("description")
        if "grade" in data and data["grade"]:
            product.grade = data["grade"]
            updated_fields.append("grade")
        if "quantity" in data:
            product.quantity = data["quantity"]
            updated_fields.append("quantity")
        if "price" in data:
            product.price = data["price"]
            updated_fields.append("price")

        if not updated_fields:
            return JsonResponse({"message": "no detected changing"}, status=400)

        product.save()
        return JsonResponse({"message": "success", "updated_fields": updated_fields}, status=200)

    except Product.DoesNotExist:
        return JsonResponse({"error": "no product"}, status=404)
    except Exception as e:
        return JsonResponse({"error": f"{str(e)}"}, status=500)

@csrf_exempt
@require_http_methods(["DELETE"])
def delete_product(request, product_id):
    """유저가 등록한 제품을 삭제"""
    try:
        product = Product.objects.get(id=product_id)
        product.delete()
        return JsonResponse({"message": "delete success"}, status=200)

    except Product.DoesNotExist:
        return JsonResponse({"error": "no product"}, status=404)
    except Exception as e:
        return JsonResponse({"error": f"{str(e)}"}, status=500)

@csrf_exempt
@require_http_methods(["PUT"])
def mark_product_as_sold(request, product_id):
    """판매 완료 처리"""
    try:
        product = Product.objects.get(id=product_id)

        if product.is_sold:
            return JsonResponse({"message": "sold out"}, status=400)

        product.is_sold = True
        product.save()
        return JsonResponse({"message": "sold out complete"}, status=200)

    except Product.DoesNotExist:
        return JsonResponse({"error": "no product"}, status=404)
    except Exception as e:
        return JsonResponse({"error": f"{str(e)}"}, status=500)

def product_create(request):
    if request.method == 'POST':
        form = ProductForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return redirect('product_list')
    else:
        form = ProductForm()
    return render(request, 'products/product_form.html', {'form': form})