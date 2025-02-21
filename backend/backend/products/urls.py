from django.urls import path
from .views import (
    add_product, get_user_products, update_product, delete_product, mark_product_as_sold, list_all_products, detail_product
)

urlpatterns = [
    path('', list_all_products, name="list_all_products"), # 전체 상품 목록 조회 (GET /products/)
    path('add/', add_product, name="add_product"),  # 제품 추가
    path('user/<int:user_id>/', get_user_products, name="get_user_products"),  # 유저가 등록한 제품 조회
    path('<int:product_id>/update/', update_product, name="update_product"),  # 제품 수정
    path('<int:product_id>/delete/', delete_product, name="delete_product"),  # 제품 삭제
    path('<int:product_id>/sold/', mark_product_as_sold, name="mark_product_as_sold"),  # 판매 완료 처리
    path('<int:product_id>/detail/', detail_product, name="detail_product"), # 단일 상품 상세 조회 (GET /products/<product_id>/detail/)
]
