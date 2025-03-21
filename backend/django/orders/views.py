import requests
from django.conf import settings
from rest_framework import generics, status, filters
from rest_framework.response import Response
from .models import Order
from .serializers import OrderSerializer
from users.models import User
from packages.models import Package
from django_filters.rest_framework import DjangoFilterBackend
from .filters import OrderFilter
from .pagination import LargeResultsSetPagination

# ✅ 1. 전체 주문 조회 및 생성 (ListCreateAPIView)
class OrderListCreateView(generics.ListCreateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]  # ✅ 필터 백엔드 추가
    filterset_class = OrderFilter  # ✅ 필터 클래스 적용
    ordering_fields = ['created_at', 'payment_status']
    pagination_class = LargeResultsSetPagination

    def create(self, request, *args, **kwargs):
        user = int(request.data.get("user"))
        package = request.data.get("package")

        user = User.objects.filter(id=user).first()
        if not user:
            return Response({"error": "유효하지 않은 유저 ID"}, status=status.HTTP_400_BAD_REQUEST)

        package = Package.objects.filter(id=package).first()
        if not package:
            return Response({"error": "유효하지 않은 패키지 ID"}, status=status.HTTP_400_BAD_REQUEST)

        # 주문 생성 (payment_status = "pending" 기본값 설정)
        # order_data = {"user": user.id, "package": package.id, "payment_status": "pending"}
        order_data = {"user": user.id, "package": package.id}
        serializer = self.get_serializer(data=order_data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        # Slack 메시지 전송
        self.send_slack_notification(user, package)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def send_slack_notification(self, user, package):
        # SLACK_WEBHOOK_URL = settings.SLACK_WEBHOOK_URL
        # SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/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'
        SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/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'

        message = f":truck: *새로운 패키지 주문이 들어왔습니다!*\n"
        message += f"👤 *구매자:* {user.name} ({user.kakao_email})\n"
        message += f"📦 *패키지:* {package.name}\n:bulb:*아이디:* {package.id}\n"
        message += f"💰 *가격:* {package.price}원\n----------------------------------------------------------------------------------------"

        payload = {"text": message}
        headers = {"Content-Type": "application/json"}

        try:
            requests.post(SLACK_WEBHOOK_URL, json=payload, headers=headers)
        except requests.exceptions.RequestException as e:
            print(f"Slack 메시지 전송 실패: {e}")

# ✅ 2. 특정 주문 조회, 수정(결제 상태 변경), 삭제 (RetrieveUpdateDestroyAPIView)
class OrderDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def retrieve(self, request, *args, **kwargs):
        """GET 요청을 통해 특정 주문 상세 조회"""
        order = self.get_object()
        serializer = self.get_serializer(order)
        return Response(serializer.data, status=status.HTTP_200_OK)