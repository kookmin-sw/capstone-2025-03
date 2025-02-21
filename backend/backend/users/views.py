import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import login, logout
from django.shortcuts import get_object_or_404
from .models import User

@csrf_exempt
def register(request):
    if request.method == "POST":
        data = json.loads(request.body)
        try:
            user = User.objects.create(
                uid=data["uid"],
                name=data["name"],
                kakao_email=data["kakao_email"],
                phone_number=data["phone_number"],
                birth_date=data["birth_date"],
                full_address=data["full_address"],
                address_detail=data["address_detail"],
            )
            return JsonResponse({"success": True, "message": "SUCCESS sign up"}, status=201)
        except Exception as e:
            return JsonResponse({"success": False, "message": str(e)}, status=400)

@csrf_exempt
def login_view(request):
    if request.method == "POST":
        data = json.loads(request.body)
        user = User.objects.filter(uid=data["uid"], kakao_email=data["kakao_email"]).first()
        
        if user:
            request.session["user_id"] = user.id  # 세션에 유저 ID 저장
            return JsonResponse({"success": True, "message": "SUCCESS login"}, status=200)
        else:
            return JsonResponse({"success": False, "message": "FAIL login"}, status=400)

@csrf_exempt
def user_info(request):
    user_id = request.session.get("user_id")
    if user_id:
        user = get_object_or_404(User, id=user_id)
        return JsonResponse({
            "success": True,
            "user": {
                "uid": user.uid,
                "name": user.name,
                "kakao_email": user.kakao_email,
                "phone_number": user.phone_number,
                "birth_date": str(user.birth_date),
            }
        })
    return JsonResponse({"success": False, "message": "FAIL need login"}, status=401)

@csrf_exempt
def logout_view(request):
    logout(request)
    return JsonResponse({"success": True, "message": "SUCCESS logout"})
