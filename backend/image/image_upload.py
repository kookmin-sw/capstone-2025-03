import os
import uuid
import io
from datetime import datetime
from typing import List

from fastapi import FastAPI, File, UploadFile, HTTPException
from pydantic import BaseModel
from google.cloud import storage
from PIL import Image
from fastapi.middleware.cors import CORSMiddleware

# GCP 인증 환경 변수 설정
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "restart-456108-c38558c2ebbd.json"

app = FastAPI()

# CORS 허용 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Google Cloud Storage 클라이언트
BUCKET_NAME = "restart-image"
storage_client = storage.Client()
bucket = storage_client.bucket(BUCKET_NAME)

# ✅ 이미지 처리 함수 (WebP로 변환하고 리사이즈)
async def process_image(image: UploadFile) -> io.BytesIO:
    img = Image.open(image.file)
    img.thumbnail((720, 720))
    image_io = io.BytesIO()
    img.save(image_io, format="WEBP", quality=95)
    image_io.seek(0)
    return image_io

# ✅ 업로드 API
@app.post("/upload/")
async def upload_image(image: UploadFile = File(...)):
    timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S%f")[:-3]
    unique_id = uuid.uuid4().hex[:6]
    image_name = f"user-uploads/{timestamp}_{unique_id}.webp"
    processed_image = await process_image(image)
    blob = bucket.blob(image_name)
    blob.upload_from_file(processed_image, content_type="image/webp")
    optimized_url = f"https://storage.googleapis.com/{BUCKET_NAME}/{image_name}"
    return {"image_url": optimized_url}

# ✅ 단건 삭제용 요청 모델
class DeleteImageRequest(BaseModel):
    file_name: str

# ✅ 다건 삭제용 요청 모델
class BulkDeleteImageRequest(BaseModel):
    file_names: List[str]

# ✅ 단건 삭제 API
@app.post("/delete-image/")
async def delete_image(req: DeleteImageRequest):
    blob = bucket.blob(req.file_name)
    try:
        blob.delete()
        return {"status": "deleted", "file_name": req.file_name}
    except Exception as e:
        if "NotFound" in str(e):
            return {"status": "not_found", "file_name": req.file_name}
        raise HTTPException(status_code=500, detail=str(e))

# ✅ 다건 삭제 API
@app.post("/delete-images/")
async def delete_images(req: BulkDeleteImageRequest):
    results = []
    for file_name in req.file_names:
        blob = bucket.blob(file_name)
        try:
            blob.delete()
            results.append({"file_name": file_name, "status": "deleted"})
        except Exception as e:
            if "NotFound" in str(e):
                results.append({"file_name": file_name, "status": "not_found"})
            else:
                results.append({"file_name": file_name, "status": "error", "detail": str(e)})
    return {"results": results}

# ✅ 로컬 실행 (선택)
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)
