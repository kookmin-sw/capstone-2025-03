from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
from pricing_model_test import predict_price
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ProductInput(BaseModel):
    name: str
    grade: str
    quantity: int = 1

@app.get("/")
async def root():
    return {"message": "fastapi server is running"}

@app.post("/predict/")
async def predict(product: ProductInput):
    product_data = {
        "name": product.name,
        "grade": product.grade,
        "quantity": product.quantity,
    }
    
    predicted_unit_price = predict_price(product_json=product_data)

    if predicted_unit_price is not None and predicted_unit_price > 0:
        total_price = predicted_unit_price * product.quantity
        return {
            "predicted_price": round(predicted_unit_price),
            "quantity": product.quantity,
            "total_predicted_price": round(total_price)
        }
    else:
        return {"error": "예측 실패"}
