from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

# API 문서 정보 설정
schema_view = get_schema_view(
    openapi.Info(
        title="RESTART API",  # API 제목
        default_version='v1.9.45.01',  # 버전
        description="restart api document",  # 설명
        terms_of_service="https://www.kookmin.ac.kr",  # 이용 약관 링크 (옵션)
        contact=openapi.Contact(email="habindohwan@google.com"),  # 연락처 (옵션)
        # license=openapi.License(name="MIT License"),  # 라이선스 (옵션)
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),  # 누구나 접근 가능
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('industries/', include('industries.urls')),
    path('categories/', include('categories.urls')),
    path('packages/', include('packages.urls')),
    path('products/', include('products.urls')),
    path('users/', include('users.urls')),
    path('orders/', include('orders.urls')),
    re_path(r'^swagger/$', schema_view.with_ui('swagger', cache_timeout=0), name='swagger-ui'),
    re_path(r'^redoc/$', schema_view.with_ui('redoc', cache_timeout=0), name='redoc'),
    path('swagger.json', schema_view.without_ui(cache_timeout=0), name='swagger-json'),
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
