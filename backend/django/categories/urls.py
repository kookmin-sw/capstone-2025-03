from django.urls import path
from categories.views import CategoryListCreateView, CategoryDetailView, RandomCategoryPreview, CategoryProductsExcludeBodyView

urlpatterns = [
    path("", CategoryListCreateView.as_view(), name="category-list-create"),
    path("<int:pk>/", CategoryDetailView.as_view(), name="category-detail"),
    path("preview/", RandomCategoryPreview.as_view(), name="category-preview"),
    path("products-exclude/", CategoryProductsExcludeBodyView.as_view(), name='category-products-exclude-body'
    ),
]
