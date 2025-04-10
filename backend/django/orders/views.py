import requests
from django.conf import settings
from django.db import transaction
from rest_framework import generics, status, filters
from rest_framework.response import Response
from .models import Order
from .serializers import OrderSerializer
from users.models import User
from products.models import Product
from django_filters.rest_framework import DjangoFilterBackend
from .filters import OrderFilter
from .pagination import LargeResultsSetPagination
from django.utils import timezone
import os

# ✅ 1. 전체 주문 조회 및 생성 (ListCreateAPIView) + 개별 물품 sales_status 변경
class OrderListCreateView(generics.ListCreateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]  # ✅ 필터 백엔드 추가
    filterset_class = OrderFilter  # ✅ 필터 클래스 적용
    ordering_fields = ['created_at', 'payment_status']
    pagination_class = LargeResultsSetPagination

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        user_id = request.data.get("user")
        product_ids = request.data.get("products", [])

        if not user_id or not product_ids:
            return Response({"error": "user와 products는 필수입니다."}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.filter(id=user_id).first()
        if not user:
            return Response({"error": "유효하지 않은 유저 ID"}, status=status.HTTP_400_BAD_REQUEST)

        # 주문 생성
        order = Order.objects.create(user=user)
        order.products.set(product_ids)

        # 선택된 상품들 판매 완료 처리
        from products.models import Product
        Product.objects.filter(id__in=product_ids).update(sales_status="sold")

        # Slack 메시지 전송
        self.send_slack_notification(user, product_ids)

        serializer = self.get_serializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


    def send_slack_notification(self, user, product_ids):
        SLACK_WEBHOOK_URL = os.getenv("SLACK_WEBHOOK_URL")

        # 실제 제품 조회
        products = Product.objects.filter(id__in=product_ids)
        total_price = sum(product.price for product in products)

        message = f":truck: *새로운 주문이 들어왔습니다!*\n"
        message += f"👤 *구매자:* {user.name} ({user.kakao_email})\n"
        message += f"🛍️ *주문 상품 목록:*\n"

        for product in products:
            message += f"- {product.name} (ID: {product.id}, ₩{product.price:,})\n"

        message += f"\n💰 *총 가격:* ₩{total_price:,}원\n"
        message += f"📅 *주문 시간:* {timezone.now().strftime('%Y-%m-%d %H:%M:%S')}\n"
        message += "-" * 50

        try:
            requests.post(SLACK_WEBHOOK_URL, json={"text": message})
        except requests.exceptions.RequestException as e:
            print(f"Slack 전송 실패: {e}")


# ✅ 2. 특정 주문 조회, 수정(결제 상태 변경), 삭제 (RetrieveUpdateDestroyAPIView)
class OrderDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def retrieve(self, request, *args, **kwargs):
        """GET 요청을 통해 특정 주문 상세 조회"""
        order = self.get_object()
        serializer = self.get_serializer(order)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @transaction.atomic
    def destroy(self, request, *args, **kwargs):
        """DELETE 요청을 통해 특정 주문 삭제"""
        order = self.get_object()

        # 주문에 포함된 제품 ID 목록 추출
        product_ids = list(order.products.values_list("id", flat=True))

        # 해당 제품들의 판매 상태를 'available'로 복구
        Product.objects.filter(id__in=product_ids).update(sales_status="available")

        # 주문 삭제
        self.perform_destroy(order)

        return Response(status=status.HTTP_204_NO_CONTENT)