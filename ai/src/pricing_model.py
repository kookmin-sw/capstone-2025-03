#!/usr/bin/env python
# -*- coding: utf-8 -*-
import os
import hashlib
import joblib
import pandas as pd
import numpy as np
import re
from datetime import datetime
from xgboost import XGBRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from google.colab import drive

drive.mount('/content/drive', force_remount=True)

DRIVE_MODEL_DIR = "/content/drive/MyDrive/ai_model/versions"
CSV_FILE_PATH = "/content/drive/MyDrive/ai_model/joongna_all_categories.csv"

class EnhancedEncoder(LabelEncoder):
    def fit_transform(self, data):
        data = super().fit_transform([str(x).lower().strip() for x in data])
        return data

class ConditionEncoder:
    def transform(self, data):
        result = []
        for x in data:
            x_str = str(x).lower().strip()
            if "중고" in x_str:
                result.append(0)
            elif "새" in x_str or "미개봉" in x_str:
                result.append(1)
            else:
                result.append(0)
        return result
    def fit_transform(self, data):
        return self.transform(data)

def get_data_hash():
    with open(CSV_FILE_PATH, 'rb') as f:
        return hashlib.md5(f.read()).hexdigest()

def refine_model_name(model_name, keyword):
    refined = re.sub(re.escape(keyword), '', model_name, flags=re.IGNORECASE).strip()
    return refined if refined != "" else model_name

def train_new_model():
    current_hash = get_data_hash()
    latest_version = None
    try:
        with open(os.path.join(DRIVE_MODEL_DIR, 'LATEST'), 'r') as f:
            latest_version = f.read().strip()
            latest_hash = joblib.load(os.path.join(DRIVE_MODEL_DIR, f"v{latest_version}", 'data_hash.joblib'))
            if latest_hash == current_hash:
                print("🔄 데이터 변경 없음 - 학습 스킵")
                return
    except Exception:
        pass

    if input("새로운 모델을 학습하시겠습니까? (y/n): ").lower() != 'y':
        return

    df = pd.read_csv(CSV_FILE_PATH, dtype=str, encoding='utf-8').dropna()
    df['가격'] = df['가격'].str.replace('[^\d]', '', regex=True).astype(int)

    for col in ['키워드', '업종', '모델명', '상품상태']:
        df[col] = df[col].str.lower().str.strip().fillna('unknown').str.replace('[^a-z0-9가-힣 ]', '', regex=True)

    df['키워드'] = df['키워드'].replace('', np.nan).fillna(df['업종'])
    df['모델명'] = df.apply(lambda row: refine_model_name(row['모델명'], row['키워드']) if row['키워드'] in row['모델명'] else row['모델명'], axis=1)
    
    df = df[~df['모델명'].str.contains("구매")]

    
    if '조회수' in df.columns:
        df['조회수'] = df['조회수'].str.replace('[^\d]', '', regex=True)
        df['조회수'] = pd.to_numeric(df['조회수'], errors='coerce').fillna(0).astype(int)
    else:
        df['조회수'] = 0

    
    encoders = {
        'keyword': EnhancedEncoder(),
        'upjong': EnhancedEncoder(),
        'model': EnhancedEncoder(),
        'condition': ConditionEncoder()
    }
    df['키워드_enc'] = encoders['keyword'].fit_transform(df['키워드'])
    df['업종_enc'] = encoders['upjong'].fit_transform(df['업종'])
    df['모델명_enc'] = encoders['model'].fit_transform(df['모델명'])
    df['상품상태_enc'] = encoders['condition'].fit_transform(df['상품상태'])

    
    df['freq'] = df.groupby(['업종', '키워드', '모델명'])['모델명'].transform('count')
    df['norm_freq'] = df.groupby('업종')['freq'].transform(lambda x: x / x.max())
    df['norm_price'] = df.groupby('업종')['가격'].transform(lambda x: (x - x.min()) / (x.max() - x.min() + 1e-8))
    df['norm_view'] = df.groupby('업종')['조회수'].transform(lambda x: (x - x.min()) / (x.max() - x.min() + 1e-8))
    # 판매확률 계산: 인기도(빈도), 가격, 조회수, 상품상태를 반영
    df['판매확률'] = (0.4 * df['norm_freq'] +
                      0.2 * (1 - df['norm_price']) +
                      0.2 * (1 - df['norm_view']) +
                      0.2 * (1 - df['상품상태_enc']))

    
    median_view_dict = df.groupby('업종')['조회수'].median().to_dict()

    # 가격 예측 모델 학습 (XGBoost 사용)
    X_price = df[['키워드_enc', '업종_enc', '모델명_enc', '상품상태_enc']]
    y_price = df['가격']
    X_train_p, X_test_p, y_train_p, y_test_p = train_test_split(X_price, y_price, test_size=0.2, random_state=42)
    price_model = XGBRegressor(n_estimators=200, max_depth=10, random_state=42, n_jobs=-1)
    price_model.fit(X_train_p, y_train_p)

    # 판매 확률 예측 모델 학습
    X_sales = df[['키워드_enc', '업종_enc', '모델명_enc', '상품상태_enc', '가격', '조회수']]
    y_sales = df['판매확률']
    X_train_s, X_test_s, y_train_s, y_test_s = train_test_split(X_sales, y_sales, test_size=0.2, random_state=42)
    sales_model = XGBRegressor(n_estimators=200, max_depth=10, random_state=42, n_jobs=-1)
    sales_model.fit(X_train_s, y_train_s)

    version_id = datetime.now().strftime("%Y%m%d-%H%M%S")
    save_path = os.path.join(DRIVE_MODEL_DIR, f"v{version_id}")
    os.makedirs(save_path, exist_ok=True)
    
    joblib.dump(price_model, os.path.join(save_path, 'price_model.joblib'))
    joblib.dump(sales_model, os.path.join(save_path, 'sales_model.joblib'))
    joblib.dump(encoders, os.path.join(save_path, 'encoders.joblib'))
    joblib.dump(median_view_dict, os.path.join(save_path, 'median_view_dict.joblib'))
    joblib.dump(current_hash, os.path.join(save_path, 'data_hash.joblib'))
    
    with open(os.path.join(DRIVE_MODEL_DIR, 'LATEST'), 'w') as f:
        f.write(version_id)

    print(f"새 모델 v{version_id} 저장")

if __name__ == "__main__":
    train_new_model()
