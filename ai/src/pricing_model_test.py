#!/usr/bin/env python
# -*- coding: utf-8 -*-
import sys
import os
import joblib
import pandas as pd
import numpy as np
import re
from google.colab import drive
from IPython.display import display

drive.mount('/content/drive')

MODEL_VERSION_DIR = "/content/drive/MyDrive/ai_model/versions"
CSV_FILE_PATH = "/content/drive/MyDrive/ai_model/joongna_all_categories.csv"

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

def preprocess_text(x):
    return str(x).lower().strip()

def refine_model_name(model_name, keyword):
    model_name = preprocess_text(model_name)
    keyword = preprocess_text(keyword)
    refined = re.sub(re.escape(keyword), '', model_name, flags=re.IGNORECASE).strip()
    return refined if refined != "" else model_name

def predict_item(category, keyword, model_name, condition, quantity=1):
    try:
        category = preprocess_text(category) or 'unknown'
        keyword = preprocess_text(keyword) or category
        model_name = preprocess_text(model_name) or 'general'
        condition = preprocess_text(condition) or '중고'
        quantity = max(1, int(quantity))
        
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
        
        filtered = filtered.copy()
        filtered['가격'] = pd.to_numeric(filtered['가격'].str.replace('[^\d]', '', regex=True), errors='coerce')
        
        group_avg = filtered['가격'].mean()
        
        filtered.loc[:, 'freq'] = filtered.groupby('업종')['모델명'].transform('count')
        filtered.loc[:, 'norm_freq'] = filtered.groupby('업종')['freq'].transform(lambda x: x / x.max())
        filtered.loc[:, 'norm_price'] = filtered.groupby('업종')['가격'].transform(lambda x: (x - x.min()) / (x.max() - x.min() + 1e-8))
        filtered.loc[:, 'norm_view'] = filtered.groupby('업종')['조회수'].transform(lambda x: (pd.to_numeric(x, errors='coerce') - pd.to_numeric(x, errors='coerce').min()) / (pd.to_numeric(x, errors='coerce').max() - pd.to_numeric(x, errors='coerce').min() + 1e-8))
        
        avg_norm_freq = filtered['norm_freq'].mean()
        avg_norm_price = filtered['norm_price'].mean()
        avg_norm_view = filtered['norm_view'].mean()
        avg_condition = filtered['상품상태'].apply(lambda x: 1 if "새" in x or "미개봉" in x else 0).mean()
        
        sales_prob = (0.4 * avg_norm_freq +
                      0.2 * (1 - avg_norm_price) +
                      0.2 * (1 - avg_norm_view) +
                      0.2 * (1 - avg_condition))
        
        total_price = group_avg * quantity
        
        print("\n--- 선택된 데이터 (원본 CSV 형식) ---")
        cols_order = ['키워드','업종','모델명','가격','상품상태','게시일','조회수','좋아요수','판매완료여부','배송가능','품질등급']
        print(filtered[cols_order].to_string(index=False))
        
        calc_data = {
            '변수': ['그룹 평균 가격', '샘플 수', 'median 조회수'],
            '값': [group_avg, len(filtered), median_view_dict.get(category, 0)]
        }
        calc_df = pd.DataFrame(calc_data)
        print("\n--- 중간 계산 변수 ---")
        print(calc_df.to_string(index=False))
        
        final_data = {
            '항목': ['예상 단가', '총 예상 금액', '판매 성공 확률'],
            '값': [int(group_avg),
                   int(total_price),
                   f"{sales_prob*100:.1f}%"]
        }
        final_df = pd.DataFrame(final_data)
        print("\n--- 최종 예측 결과 계산 상세 ---")
        print(final_df.to_string(index=False))
        
        print(f"\n입력된 상품 상태: '{condition}'")
        
        return {
            'predicted_price': int(group_avg),
            'total_price': int(total_price),
            'sales_probability': sales_prob
        }
    except Exception as e:
        print(f"예측 오류: {str(e)}")
        return None

if __name__ == "__main__":
    print("중고거래 가격 예측 테스트 (그룹 평균 방식 - 미리 범주화)")
    while True:
        try:
            category   = input("\n업종 입력 (예: 전자제품): ").strip()
            keyword    = input("키워드 입력 (생략 가능): ").strip()
            model_name = input("모델명 입력: ").strip()
            condition  = input("상태 입력 (예: 새상품, 중고): ").strip()
            quantity   = input("수량 입력 (기본 1): ").strip()
            quantity = int(quantity) if quantity else 1
            
            result = predict_item(
                category or "unknown",
                keyword or category,
                model_name or "general",
                condition or "중고",
                quantity
            )
            
            if result:
                print("\n예측 결과:")
                print("• 예상 단가:", f"{result['predicted_price']:,}원")
                print("• 총 예상 금액:", f"{result['total_price']:,}원")
                print("• 판매 성공 확률:", f"{result['sales_probability']*100:.1f}%")
        except KeyboardInterrupt:
            print("\n프로그램을 종료합니다.")
            break
        if input("\n다시 예측하시겠습니까? (y/n): ").lower() != "y":
            print("종료합니다.")
            break
