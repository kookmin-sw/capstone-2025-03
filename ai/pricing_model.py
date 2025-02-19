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

def preprocess_text(x):
    return str(x).lower().strip()

def refine_model_name(model_name, keyword):
    refined = re.sub(re.escape(keyword), '', model_name, flags=re.IGNORECASE).strip()
    return refined if refined != "" else model_name

def map_condition(x):
    x_str = preprocess_text(x)
    if x_str in ["새상품", "미개봉"]:
        return 1
    elif x_str == "중고":
        return 0
    else:
        return 0

def filter_rare_categories(df, cols, threshold=20):
    for col in cols:
        counts = df[col].value_counts()
        rare = counts[counts < threshold].index
        df.loc[:, col] = df[col].replace(rare, 'other')
    return df

def train_new_model():
    print("학습 코드 실행 시작...")
    current_hash = get_data_hash()
    
    df = pd.read_csv(CSV_FILE_PATH, dtype=str, encoding='utf-8').dropna()
    print(f"CSV 파일 읽기 완료, 총 {len(df)}행")
    
    print("가격 전처리 중...")
    df.loc[:, '가격'] = pd.to_numeric(df['가격'].str.replace('[^\d]', '', regex=True), errors='coerce').astype(int)
    
    print("텍스트 전처리 중...")
    for col in ['키워드', '업종', '모델명', '상품상태']:
        df.loc[:, col] = df[col].apply(preprocess_text)
        df.loc[:, col] = df[col].fillna('unknown').str.replace('[^a-z0-9가-힣 ]', '', regex=True)
    
    df.loc[:, '키워드'] = df['키워드'].replace('', np.nan).fillna(df['업종'])
    print("모델명 정제 중...")
    df.loc[:, '모델명'] = df.apply(lambda row: refine_model_name(row['모델명'], row['키워드']), axis=1)
    df = df[~df['모델명'].str.contains("구매")]
    
    if '조회수' in df.columns:
        print("조회수 전처리 중...")
        df.loc[:, '조회수'] = pd.to_numeric(df['조회수'].str.replace('[^\d]', '', regex=True), errors='coerce').fillna(0).astype(int)
    else:
        df['조회수'] = 0

    print("상품상태 매핑 중...")
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
    
    print("추가 피처 생성 중...")
    df['freq'] = df.groupby(['업종', '키워드', '모델명'])['모델명'].transform('count')
    df['norm_freq'] = df.groupby('업종')['freq'].transform(lambda x: x / x.max())
    df['norm_price'] = df.groupby('업종')['가격'].transform(lambda x: (x - x.min()) / (x.max() - x.min() + 1e-8))
    df['norm_view'] = df.groupby('업종')['조회수'].transform(lambda x: (x - x.min()) / (x.max() - x.min() + 1e-8))
    df['판매확률'] = (0.4 * df['norm_freq'] +
                      0.2 * (1 - df['norm_price']) +
                      0.2 * (1 - df['norm_view']) +
                      0.2 * (1 - df['상품상태_enc']))
    
    median_view_dict = df.groupby('업종')['조회수'].median().to_dict()

    group_cols = ['업종', '키워드', '모델명']
    group_stats = df.groupby(group_cols)['가격'].agg(['mean', 'count']).reset_index()
    
    global_avg_price = df['가격'].mean()
    
    stats = {
        'group_stats': group_stats,
        'global_avg_price': global_avg_price,
    }
    
    version_id = datetime.now().strftime("%Y%m%d-%H%M%S")
    save_path = os.path.join(DRIVE_MODEL_DIR, f"v{version_id}")
    os.makedirs(save_path, exist_ok=True)
    
    joblib.dump(stats, os.path.join(save_path, 'group_stats.joblib'))
    joblib.dump(median_view_dict, os.path.join(save_path, 'median_view_dict.joblib'))
    joblib.dump(current_hash, os.path.join(save_path, 'data_hash.joblib'))
    
    with open(os.path.join(DRIVE_MODEL_DIR, 'LATEST'), 'w') as f:
        f.write(version_id)

    print(f"새 모델 v{version_id} 저장 완료!")

if __name__ == "__main__":
    train_new_model()
