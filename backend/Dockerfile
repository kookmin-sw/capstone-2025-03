# # Python 3.10-slim 이미지 사용
# FROM python:3.10-slim

# # 환경 변수 설정 (Python 출력 버퍼링 해제)
# ENV PYTHONUNBUFFERED=1

# # 시스템 패키지 업데이트 및 nginx, supervisor 설치
# RUN apt-get update && apt-get install -y \
#     nginx \
#     supervisor \
#  && rm -rf /var/lib/apt/lists/*

# # 작업 디렉토리 설정
# WORKDIR /app

# # Python 의존성 파일 복사 및 설치
# COPY backend/requirements.txt /app/
# RUN pip install --upgrade pip && pip install -r requirements.txt

# # 프로젝트 전체 복사 (Django 프로젝트와 FastAPI 파일 포함)
# COPY . /app/

# # Nginx 설정 파일 복사
# COPY nginx.conf /etc/nginx/nginx.conf

# # Supervisor 설정 파일 복사
# COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# # 컨테이너에서 사용할 포트 (Cloud Run 등에서 이 포트를 사용)
# EXPOSE 8080

# # Supervisor 실행 (Nginx, Django, FastAPI 모두 시작됨)
# CMD ["/usr/bin/supervisord", "-n"]


# Python 3.10-slim 이미지 사용
FROM python:3.10-slim

# Python 출력 즉시 확인을 위해
ENV PYTHONUNBUFFERED=1

# 시스템 패키지 업데이트 및 nginx, supervisor 설치
RUN apt-get update && apt-get install -y \
    nginx \
    supervisor \
 && rm -rf /var/lib/apt/lists/*

# 작업 디렉토리 설정
WORKDIR /app

# 프로젝트 의존성 설치
COPY backend/requirements.txt /app/
RUN pip install --upgrade pip && pip install -r requirements.txt

# 전체 프로젝트 복사
COPY . /app/

# Nginx, Supervisor 설정 파일 복사 (파일 명은 예시이며 실제 파일 명과 맞춰야 함)
COPY nginx.conf /etc/nginx/nginx.conf
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Cloud Run 등에서 사용할 포트
EXPOSE 8080

# Supervisor로 모든 프로세스(Django, FastAPI, Nginx) 실행
CMD ["/usr/bin/supervisord", "-n"]
