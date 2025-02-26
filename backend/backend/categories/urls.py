from django.urls import path
from categories.views import CategoryCreateView, CategoryListView, CategoryDetailView

urlpatterns = [
    path("", CategoryListView.as_view(), name="category-list"),
    path("create/", CategoryCreateView.as_view(), name="category-create"),
    path("<int:pk>/", CategoryDetailView.as_view(), name="category-detail"),
]
