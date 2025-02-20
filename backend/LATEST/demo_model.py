import os
import joblib
import numpy as np
import re
import pandas as pd
import argparse
from LATEST.encoders import EnhancedEncoder, ConditionEncoder
import sys
import __main__

setattr(__main__, "EnhancedEncoder", EnhancedEncoder)
setattr(__main__, "ConditionEncoder", ConditionEncoder)

MODEL_VERSION_DIR = "LATEST"
CSV_FILE_PATH = "joongna_all_categories.csv"

try:
    with open(os.path.join(MODEL_VERSION_DIR, 'LATEST'), 'r') as f:
        latest_version = f.read().strip()
    latest_dir = os.path.join(MODEL_VERSION_DIR, f"v{latest_version}")
except Exception as e:
    print(f"모델 버전 로딩 오류: {e}")
    sys.exit(1)

try:
    stats_model = joblib.load(os.path.join(latest_dir, 'stats_model.joblib'))
    sales_model = joblib.load(os.path.join(latest_dir, 'sales_model.joblib'))
    encoders = joblib.load(os.path.join(latest_dir, 'encoders.joblib'))
    median_view_dict = joblib.load(os.path.join(latest_dir, 'median_view_dict.joblib'))
except Exception as e:
    print(f"모델 로딩 오류: {e}")
    sys.exit(1)

def preprocess_text(text):
    return str(text).lower().strip()

def map_condition(x):
    x_str = preprocess_text(x)
    if x_str in ["새상품", "미개봉"]:
        return 1
    elif x_str == "중고":
        return 0
    else:
        return None 

def refine_model_name(model_name, keyword):
    model_name = preprocess_text(model_name)
    keyword = preprocess_text(keyword)
    refined = re.sub(re.escape(keyword), '', model_name, flags=re.IGNORECASE).strip()
    return refined if refined != "" else model_name

def predict_item(category, keyword, model_name, condition, quantity=1):
    try:
        category   = preprocess_text(category) or 'unknown'
        keyword    = preprocess_text(keyword) or category
        model_name = preprocess_text(model_name) or 'general'
        condition  = preprocess_text(condition) or '중고'
        quantity   = max(1, int(quantity))
        
        model_name_refined = refine_model_name(model_name, keyword)
        
        df = pd.read_csv(CSV_FILE_PATH, dtype=str, encoding='utf-8').dropna()
        for col in ['키워드', '업종', '모델명', '상품상태']:
            df[col] = df[col].apply(preprocess_text)
        
        filtered = df[
            df['업종'].str.contains(category, case=False, na=False) &
            df['키워드'].str.contains(keyword, case=False, na=False) &
            df['모델명'].str.contains(model_name_refined, case=False, na=False)
        ]
        
        if filtered.empty:
            print("입력하신 조건에 해당하는 데이터가 없습니다.")
            return None
        
        print(filtered.to_string(index=False))
        
        filtered = filtered.copy()
        filtered['가격'] = pd.to_numeric(filtered['가격'].str.replace('[^\d]', '', regex=True), errors='coerce')
        
        group_avg = filtered['가격'].mean()
        
        filtered.loc[:, 'freq'] = filtered.groupby('업종')['모델명'].transform('count')
        filtered.loc[:, 'norm_freq'] = filtered.groupby('업종')['freq'].transform(lambda x: x / x.max())
        filtered.loc[:, 'norm_price'] = filtered.groupby('업종')['가격'].transform(lambda x: (x - x.min()) / (x.max() - x.min() + 1e-8))
        filtered.loc[:, 'norm_view'] = filtered.groupby('업종')['조회수'].transform(
            lambda x: (pd.to_numeric(x, errors='coerce') - pd.to_numeric(x, errors='coerce').min()) /
                      (pd.to_numeric(x, errors='coerce').max() - pd.to_numeric(x, errors='coerce').min() + 1e-8)
        )
        
        avg_norm_freq  = filtered['norm_freq'].mean()
        avg_norm_price = filtered['norm_price'].mean()
        avg_norm_view  = filtered['norm_view'].mean()
        avg_condition  = filtered['상품상태'].apply(lambda x: 1 if ("새" in x or "미개봉" in x) else 0).mean()
        
        sales_prob = (0.4 * avg_norm_freq +
                      0.2 * (1 - avg_norm_price) +
                      0.2 * (1 - avg_norm_view) +
                      0.2 * (1 - avg_condition))
        
        total_price = group_avg * quantity
        recommended_range = f"{int(group_avg * 0.8):,} ~ {int(group_avg * 1.2):,}원"
        
        final_result = {
            '단가': int(group_avg),
            '총가격': int(total_price),
            '판매확률': f"{sales_prob*100:.1f}%",
            '추천 가격 범위': recommended_range
        }
        return final_result
    except Exception as e:
        print(f"예측 오류: {str(e)}")
        return None

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="중고거래 가격 예측")
    parser.add_argument("--category", type=str, required=True, help="업종 입력 (예: 전자제품)")
    parser.add_argument("--keyword", type=str, default="", help="키워드 입력 (생략 가능)")
    parser.add_argument("--model_name", type=str, required=True, help="모델명 입력")
    parser.add_argument("--condition", type=str, required=True, help="상품 상태 입력 (예: 새상품, 중고)")
    parser.add_argument("--quantity", type=int, default=1, help="수량 입력 (기본 1)")
    args = parser.parse_args()

    keyword = args.keyword if args.keyword else args.category

    result = predict_item(args.category, keyword, args.model_name, args.condition, args.quantity)
    if result:
        print("\n=== 예측 결과 ===")
        print(f"• 예상 단가: {result['단가']:,}원")
        print(f"• 총 예상 금액: {result['총가격']:,}원")
        print(f"• 판매 성공 확률: {result['판매확률']}")
        print(f"• 추천 가격 범위: {result['추천 가격 범위']}")
    else:
        print("예측 실패")
