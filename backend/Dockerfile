# Python 3.10-slim 이미지 사용
FROM python:3.10-slim

# Python 출력 즉시 확인을 위해 설정
ENV PYTHONUNBUFFERED=1

# 필수 패키지 및 Nginx, Supervisor 설치
RUN apt-get update && apt-get install -y \
    nginx \
    supervisor \
 && rm -rf /var/lib/apt/lists/*

# 작업 디렉토리 설정
WORKDIR /app

# 프로젝트 의존성 설치
COPY backend/requirements.txt /app/
RUN pip install --no-cache-dir --upgrade pip && pip install -r requirements.txt

# 프로젝트 전체 복사
COPY . /app/

# Nginx, Supervisor 설정 파일 복사
COPY nginx.conf /etc/nginx/nginx.conf
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Cloud Run 및 Docker에서 사용할 포트 설정
EXPOSE 8000 8001 8002 8080

# Google Cloud 인증 정보 환경 변수 설정
ENV GOOGLE_APPLICATION_CREDENTIALS="/app/restart-451418-3c0f7ccad0ee.json"

# google-cloud-storage 라이브러리 설치
RUN pip install --no-cache-dir google-cloud-storage

# Supervisor 실행 (모든 서비스 관리)
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf", "-n"]
