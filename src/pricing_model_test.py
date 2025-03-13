import os
import sys
import json
import re
import joblib
import pandas as pd
import numpy as np
from datetime import datetime
from konlpy.tag import Okt

MODEL_DIR = "./ai_model/versions"
MAIN_CSV_FILE_PATH = "./ai_model/output_with_price_category.csv"
PRODUCT_JSON_PATH = "./product.json"

try:
    with open(os.path.join(MODEL_DIR, 'LATEST'), 'r', encoding='utf-8') as f:
        latest_version = f.read().strip()
    latest_dir = os.path.join(MODEL_DIR, f"v{latest_version}")
except Exception as e:
    print(f"모델 버전 로딩 실패: {e}")
    sys.exit(1)

try:
    price_model = joblib.load(os.path.join(latest_dir, 'price_model.joblib'))
    cat_encoder = joblib.load(os.path.join(latest_dir, 'category_encoder.joblib'))
    cond_encoder = joblib.load(os.path.join(latest_dir, 'condition_encoder.joblib'))
    pricecat_encoder = joblib.load(os.path.join(latest_dir, 'price_cat_encoder.joblib'))
    all_industries = joblib.load(os.path.join(latest_dir, 'industry_labels.joblib'))
    title_vectorizer = joblib.load(os.path.join(latest_dir, 'title_vectorizer.joblib'))
    title_pca = joblib.load(os.path.join(latest_dir, 'title_pca.joblib'))
    feature_columns = joblib.load(os.path.join(latest_dir, 'feature_columns.joblib'))
except Exception as e:
    print(f"모델 로딩 실패: {e}")
    sys.exit(1)

try:
    df_main = pd.read_csv(MAIN_CSV_FILE_PATH, encoding='utf-8')
except Exception as e:
    print(f"output_with_price_category.csv 로딩 실패: {e}")
    sys.exit(1)

def multi_hot_encode_industry(industry_str, all_inds):
    row_dict = {}
    inds = [i.strip() for i in str(industry_str).split(',') if i.strip()]
    for ind in all_inds:
        col_name = "IND_" + re.sub(r"\W+", "", ind)
        row_dict[col_name] = 1 if ind in inds else 0
    row_dict["INDUSTRY_COUNT"] = len(inds)
    return row_dict

def preprocess_title(text):
    if pd.isna(text):
        return ""
    okt = Okt()
    tokens = okt.morphs(text)
    return " ".join(tokens)

def prepare_input_from_product(product_json: dict) -> pd.DataFrame:
    full_title = str(product_json.get("name", "UNKNOWN")).strip()
    
    matched = df_main[df_main["TITLE"].str.contains(full_title, na=False)]
    if not matched.empty:
        category_str = matched.iloc[0]["CATEGORY"]
        industry_str = str(matched.iloc[0].get("INDUSTRY", "기타"))
        popularity_score = matched.iloc[0].get("POPULARITY_SCORE", 0)
        category_pop_score = matched.iloc[0].get("CATEGORY_POPULARITY_SCORE", 0)
        price_category_val = str(matched.iloc[0].get("PRICE_CATEGORY", "Mid"))
    else:
        category_str = full_title  
        industry_str = "기타"
        popularity_score = 0
        category_pop_score = 0
        price_category_val = "Mid"
    
    print(f"검색된 업종: {industry_str}")
    
    industry_encoded = multi_hot_encode_industry(industry_str, all_industries)
    
    try:
        cat_enc_val = cat_encoder.transform([category_str])[0]
    except Exception as e:
        cat_enc_val = 0
    try:
        product_condition_str = str(product_json.get("grade", "중고")).strip()
        cond_enc_val = cond_encoder.transform([product_condition_str])[0]
    except Exception as e:
        cond_enc_val = 0
    try:
        pricecat_enc_val = pricecat_encoder.transform([price_category_val])[0]
    except Exception as e:
        pricecat_enc_val = 0
    
    upload_date_str = product_json.get("upload_date", None)
    try:
        dt = pd.to_datetime(upload_date_str)
        post_month = dt.month
    except Exception as e:
        post_month = 0
    
    title_processed = preprocess_title(full_title)
    tfidf_vec = title_vectorizer.transform([title_processed])
    title_pca_features = title_pca.transform(tfidf_vec.toarray())[0]
    title_pca_dict = {f"TITLE_PCA_{i}": title_pca_features[i] for i in range(title_pca.n_components_)}
    
    features_dict = {
        "CATEGORY_enc": cat_enc_val,
        "PRODUCT_CONDITION_enc": cond_enc_val,
        "POPULARITY_SCORE": popularity_score,
        "CATEGORY_POPULARITY_SCORE": category_pop_score,
        "POST_MONTH": post_month,
        "PRICE_CATEGORY_enc": pricecat_enc_val
    }
    features_dict.update(industry_encoded)
    features_dict.update(title_pca_dict)
    
    X_df = pd.DataFrame([features_dict])
    X_df = X_df.reindex(columns=feature_columns, fill_value=0)
    return X_df

def predict_price(product_json: dict) -> float:
    try:
        X_df = prepare_input_from_product(product_json)
        y_pred = price_model.predict(X_df)
        return float(y_pred[0])
    except Exception as e:
        print(f"예측 실패: {e}")
        return None

if __name__ == "__main__":
    print("제품 예측 실행")
    try:
        with open(PRODUCT_JSON_PATH, 'r', encoding='utf-8') as f:
            product_data = json.load(f)
    except Exception as e:
        print(f"product.json 로딩 실패: {e}")
        sys.exit(1)
    
    predicted_unit_price = predict_price(product_data)
    if predicted_unit_price is not None and predicted_unit_price > 0:
        quantity = int(product_data.get("quantity", 1))
        total_price = predicted_unit_price * quantity
        print("\n--- 예측 결과 ---")
        print(f"제품명(상세 모델명): {product_data.get('name')}")
        print(f"상품 상태: {product_data.get('grade')}")
        print(f"업로드 날짜: {product_data.get('upload_date')}")
        print(f"예측 단가: {round(predicted_unit_price, 2):,}원")
        print(f"수량: {quantity}")
        print(f"총 예상 금액: {round(total_price, 2):,}원")
    else:
        print("예측에 실패했습니다.")
