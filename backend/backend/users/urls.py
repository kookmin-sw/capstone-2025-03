from django.urls import path
from .views import (
    RegisterView,
    UserDetailView,
    LoginView,
    UserInfoView,
    LogoutView,
    UserListView,
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='user-register'),  # 회원가입 (POST)
    path('<int:pk>/', UserDetailView.as_view(), name='user-detail'),  # 특정 유저 정보 조회/수정/삭제 (GET, PATCH, DELETE)
    path('login/', LoginView.as_view(), name='user-login'),  # 로그인 (POST)
    path('info/', UserInfoView.as_view(), name='user-info'),  # 현재 로그인한 유저 정보 조회 (GET)
    path('logout/', LogoutView.as_view(), name='user-logout'),  # 로그아웃 (POST)
     path('users/', UserListView.as_view(), name='user_list'), # 유저 전체 조회 (GET)
]
