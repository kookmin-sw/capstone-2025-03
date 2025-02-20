from django.urls import path
from .views import industry_list

urlpatterns = [
    path('', industry_list, name='industry_list'),
]
