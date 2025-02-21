from django.urls import path
from .views import (
    package_list,
    package_create,
    package_detail,
    package_update,
    package_delete
)

urlpatterns = [
    # GET /packages/ : 전체 패키지 목록 조회
    path('', package_list, name='package_list'),
    
    # POST /packages/add/ : 패키지 생성
    path('add/', package_create, name='package_create'),

    # GET /packages/<int:pk>/ : 단일 패키지 상세 조회
    path('<int:pk>/', package_detail, name='package_detail'),

    # PUT /packages/<int:pk>/update/ : 패키지 수정
    path('<int:pk>/update/', package_update, name='package_update'),

    # DELETE /packages/<int:pk>/delete/ : 패키지 삭제
    path('<int:pk>/delete/', package_delete, name='package_delete'),
]
