from django.urls import path
from .views import (
    ProductListCreateView,
    ProductDetailView,
    # UserProductsView,
    MarkProductAsSoldView,
)

urlpatterns = [
    path('', ProductListCreateView.as_view(), name='product-list-create'),  # 전체 상품 조회 & 생성
    path('<int:pk>/', ProductDetailView.as_view(), name='product-detail'),  # 단일 상품 조회, 수정, 삭제
    # path('user/<int:user_id>/', UserProductsView.as_view(), name='user-products'),  # 특정 유저의 상품 조회
    path('<int:product_id>/sold/', MarkProductAsSoldView.as_view(), name='mark-product-as-sold'),  # 판매 완료 처리
]
