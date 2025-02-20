from django.urls import path
from .views import register, login_view, user_info, logout_view

urlpatterns = [
    path("register/", register, name="register"),
    path("login/", login_view, name="login"),
    path("user-info/", user_info, name="user_info"),
    path("logout/", logout_view, name="logout"),
]
