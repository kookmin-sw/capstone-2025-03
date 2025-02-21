from django.urls import path
from .views import category_list, category_create, category_update, category_delete

urlpatterns = [
    path('', category_list, name='category_list'),
    path('create/', category_create, name='category_create'),
    path('<int:category_id>/update/', category_update, name='category_update'),
    path('<int:category_id>/delete/', category_delete, name='category_delete'),
]
