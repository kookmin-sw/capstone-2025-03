from django.urls import path
from .views import (
    UserListCreateView,
    UserDetailView,
    LoginView,
)

urlpatterns = [
    path('', UserListCreateView.as_view(), name='user-list-create'),  #  유저 전체 조회 (GET) & 회원가입 (POST)
    path('<int:pk>/', UserDetailView.as_view(), name='user-detail'),  # 특정 유저 정보 조회/수정/삭제 (GET, PATCH, DELETE)
    path('login/', LoginView.as_view(), name='user-login'),  # 로그인 (POST)
]
