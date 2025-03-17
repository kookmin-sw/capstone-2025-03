import requests
from django.conf import settings
from rest_framework import generics, status
from rest_framework.response import Response
from .models import Order
from .serializers import OrderSerializer
from users.models import User
from packages.models import Package

class OrderCreateView(generics.CreateAPIView):
    """
    구매자가 패키지를 구매하면 주문을 생성하고 Slack 채널로 주문 정보를 전송
    """
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def create(self, request, *args, **kwargs):
        user_id = request.data.get("user_id")
        package_id = request.data.get("package_id")

        # 유저 정보 확인
        user = User.objects.filter(id=user_id).first()
        if not user:
            return Response({"error": "유효하지 않은 유저 ID"}, status=status.HTTP_400_BAD_REQUEST)

        # 패키지 정보 확인
        package = Package.objects.filter(id=package_id).first()
        if not package:
            return Response({"error": "유효하지 않은 패키지 ID"}, status=status.HTTP_400_BAD_REQUEST)

        # 주문 생성
        order_data = {"user": user.id, "package": package.id}
        serializer = self.get_serializer(data=order_data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        # Slack 메시지 전송
        self.send_slack_notification(user, package)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def send_slack_notification(self, user, package):
        """
        주문 정보를 Slack 채널로 전송 (Webhook URL은 비공개 처리)
        """
        # SLACK_WEBHOOK_URL = settings.SLACK_WEBHOOK_URL  # 나중에 실제 URL 추가
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

#✅ 1️⃣ Slack Webhook URL 생성 방법
# Slack Incoming Webhooks 페이지로 이동
# "Create a new app" 클릭 후 앱 생성
# 웹훅(Webhook) 추가 및 Slack 채널 연결
# 생성된 Webhook URL을 복사하여 settings.py에 추가