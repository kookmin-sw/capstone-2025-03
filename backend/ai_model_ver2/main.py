from dotenv import load_dotenv
import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from google.cloud import storage
from fastapi.middleware.cors import CORSMiddleware
from depreciation_predict import predict_depreciation_and_price

# .env 파일에서 환경변수 로드
load_dotenv()

# 환경변수 가져오기
BUCKET_NAME = os.getenv("GCS_BUCKET_NAME")
MODEL_DIR   = os.getenv("MODEL_DIR")
MODEL_FILE  = os.getenv("MODEL_FILE", "model.safetensors")  # 기본값 유지
CSV_PATH    = os.getenv("CSV_PATH")

# 1) GCS에서 모델 파일 내려받기

def ensure_model_download(bucket_name: str, blob_name: str, dest_dir: str):
    os.makedirs(dest_dir, exist_ok=True)
    dest_path = os.path.join(dest_dir, blob_name)
    if not os.path.exists(dest_path):
        client = storage.Client()
        bucket = client.bucket(bucket_name)
        blob   = bucket.blob(blob_name)
        blob.download_to_filename(dest_path)
        print(f"[GCS] Downloaded {blob_name} → {dest_path}")

# 앱 시작 시 모델 확보
ensure_model_download(BUCKET_NAME, MODEL_FILE, MODEL_DIR)

# 2) FastAPI 앱 정의
app = FastAPI()

# 3) CORS 미들웨어 등록
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

class PredictRequest(BaseModel):
    model_name: str
    description: str

class PredictResponse(BaseModel):
    original_price: int
    depreciation_rate: float
    used_price: int

@app.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest):
    try:
        orig, rate, used = predict_depreciation_and_price(
            model_dir   = MODEL_DIR,
            model_name  = req.model_name,
            description = req.description,
            data_csv    = CSV_PATH
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    return PredictResponse(
        original_price    = orig,
        depreciation_rate = rate,
        used_price        = used
    )
