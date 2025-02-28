from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.contrib.auth import logout
from rest_framework.permissions import AllowAny
from .models import User
from .serializers import UserSerializer

# ✅ 1. 유저 회원가입 (POST)
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]  # 회원가입은 인증 불필요

# ✅ 2. 특정 유저 정보 조회, 수정, 삭제
class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

# ✅ 3. 로그인 (POST)
class LoginView(APIView):
    permission_classes = [AllowAny]  # 로그인은 인증 불필요

    def post(self, request):
        data = request.data
        user = User.objects.filter(kakao_email=data.get("kakao_email")).first()

        if user:
            request.session["user_id"] = user.id  # 세션 저장
            return Response({"success": True, "message": "SUCCESS login"}, status=status.HTTP_200_OK)

        return Response({"success": False, "message": "FAIL login"}, status=status.HTTP_400_BAD_REQUEST)

# ✅ 4. 현재 로그인한 유저 정보 조회 (GET)
class UserInfoView(APIView):
    def get(self, request):
        user_id = request.session.get("user_id")
        if not user_id:
            return Response({"success": False, "message": "FAIL need login"}, status=status.HTTP_401_UNAUTHORIZED)

        user = get_object_or_404(User, id=user_id)
        serializer = UserSerializer(user)
        return Response({"success": True, "user": serializer.data})

# ✅ 5. 로그아웃 (POST)
class LogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response({"success": True, "message": "SUCCESS logout"}, status=status.HTTP_200_OK)
