#!/bin/bash
# 프로젝트 ID와 지역을 환경 변수에 설정합니다.
export PROJECT_ID=YOUR_PROJECT_ID
export REGION=asia-northeast3

# Docker 이미지 빌드 및 푸시
docker build -t gcr.io/$PROJECT_ID/backend .
docker push gcr.io/$PROJECT_ID/backend

# Cloud Run에 배포
gcloud run deploy backend \
  --image gcr.io/$PROJECT_ID/backend \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated
