import os
import uuid
import io
from datetime import datetime
from fastapi import FastAPI, File, UploadFile
from google.cloud import storage
from PIL import Image

# ✅ 환경 변수 설정 (Google Cloud 인증)
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "/app/restart-451418-3c0f7ccad0ee.json"

# ✅ FastAPI 앱 초기화
app = FastAPI()

# ✅ Google Cloud Storage 클라이언트 생성
BUCKET_NAME = "restart-images"  # 🔹 GCS 버킷 이름
storage_client = storage.Client()
bucket = storage_client.bucket(BUCKET_NAME)

# ✅ 이미지 처리 함수 (WebP 변환, 품질 최적화, 크기 조정)
async def process_image(image: UploadFile) -> io.BytesIO:
    """ 이미지 변환 (WebP 형식, 크기 및 품질 최적화) """
    
    img = Image.open(image.file)
    
    # 🔹 이미지 크기 조정 (최대 720x720)
    max_size = (720, 720)
    img.thumbnail(max_size)

    # 🔹 WebP 변환 및 최적화 (품질 95%)
    image_io = io.BytesIO()
    img.save(image_io, format="WEBP", quality=95)
    image_io.seek(0)

    return image_io

# ✅ 이미지 업로드 API
@app.post("/upload/")
async def upload_image(image: UploadFile = File(...)):
    """ 이미지 업로드 후 최적화된 GCS URL 반환 """

    # ✅ 고유한 파일명 생성 (당근마켓 스타일)
    timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S%f")[:-3]
    unique_id = uuid.uuid4().hex[:6]  # 짧은 UUID 생성
    image_name = f"user-uploads/{timestamp}_{unique_id}.webp"

    # ✅ 이미지 변환
    processed_image = await process_image(image)

    # ✅ GCS에 이미지 저장
    blob = bucket.blob(image_name)
    blob.upload_from_file(processed_image, content_type="image/webp")

    # ✅ GCS 퍼블릭 URL 생성
    optimized_url = f"https://storage.googleapis.com/{BUCKET_NAME}/{image_name}"

    return {"image_url": optimized_url}

# ✅ FastAPI 실행 (포트 지정)
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)  # 🔹 포트 명확히 지정 (8002)
