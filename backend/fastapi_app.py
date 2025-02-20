from fastapi import FastAPI
from pydantic import BaseModel
from LATEST.demo_model import predict_item
app = FastAPI()

class Item(BaseModel):
    name: str
    price: float
    industry: str

@app.get("/items/{item_id}")
def read_item(item_id: int):
    return {"item_id": item_id, "name": "Example Item"}

@app.post("/items/")
def create_item(item: Item):
    return {"name": item.name, "price": item.price, "industry": item.industry}

# AI 모델 호출을 위한 엔드포인트
class AIRequest(BaseModel):
    input_data: str

@app.post("/predict")
def predict(request: AIRequest):
    # 입력 문자열을 쉼표로 분리하고, 각 항목을 공백 제거하여 할당
    parts = [part.strip() for part in request.input_data.split(",")]
    if len(parts) < 5:
        return {"error": "입력 데이터 형식이 올바르지 않습니다."}
    category, keyword, model_name, condition, quantity_str = parts
    try:
        quantity = int(quantity_str)
    except ValueError:
        return {"error": "수량이 올바른 숫자가 아닙니다."}
    # predict_item 함수를 호출 (run_ai_model = predict_item)
    result = predict_item(category, keyword, model_name, condition, quantity)
    return result


if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)

