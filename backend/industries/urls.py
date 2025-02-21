from django.urls import path
from .views import industry_list, industry_create, industry_update, industry_delete

urlpatterns = [
    path('', industry_list, name='industry_list'),
    path('create/', industry_create, name='industry_create'),
    path('<int:industry_id>/update/', industry_update, name='industry_update'),
    path('<int:industry_id>/delete/', industry_delete, name='industry_delete'),
]
