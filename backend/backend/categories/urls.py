from django.urls import path
from categories.views import CategoryCreateView, CategoryListView, CategoryDetailView

urlpatterns = [
    path("categories/", CategoryListView.as_view(), name="category-list"),  
    path("categories/create/", CategoryCreateView.as_view(), name="category-create"),  
    path("categories/<int:pk>/", CategoryDetailView.as_view(), name="category-detail"), 
]
