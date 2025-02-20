from django.urls import path
from .views import package_list

urlpatterns = [
    path('', package_list, name='package_list'),
]
