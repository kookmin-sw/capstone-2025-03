import torch
import pandas as pd
from transformers import AutoTokenizer, AutoModelForSequenceClassification

def predict_depreciation_and_price(model_dir: str, model_name: str, description: str, data_csv: str = "depreciation_data.csv"):
    df = pd.read_csv(data_csv)
    matches = df[df["모델명"] == model_name]
    if matches.empty:
        raise ValueError(f"CSV에 '{model_name}' 모델명이 없습니다.")
    original_price = int(matches.iloc[0]["가격"])

    tokenizer = AutoTokenizer.from_pretrained(model_dir)
    model     = AutoModelForSequenceClassification.from_pretrained(model_dir)
    model.eval()

    text = f"{model_name} [가스레인지] {description}"
    enc  = tokenizer(
        text,
        padding='max_length',
        truncation=True,
        max_length=128,
        return_tensors='pt'
    )

    with torch.no_grad():
        outputs = model(**enc)
        rate = outputs.logits.squeeze().item()

    used_price = int(original_price * (1 - rate))

    return original_price, rate, used_price

def main():
    model_dir   = "depr_model"  
    model_name  = "매직쉐프 MMW-W23FDHW"  
    description = "2년 사용, 생활 기스 있음, 정상 작동"  

    orig_price, rate, used_price = predict_depreciation_and_price(
        model_dir   = model_dir,
        model_name  = model_name,
        description = description,
        data_csv    = "depreciation_data.csv"
    )

    print(f"모델명       : {model_name}")
    print(f"상품설명     : {description}")
    print(f"원본 가격    : {orig_price:,}원")
    print(f"예측된 감가율: {rate:.2%}")
    print(f"예측 중고가  : {used_price:,}원")

if __name__ == "__main__":
    main()
