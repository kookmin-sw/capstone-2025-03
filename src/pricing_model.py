import os
import re
import hashlib
import joblib
import pandas as pd
import numpy as np
from datetime import datetime
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
from xgboost import XGBRegressor
from konlpy.tag import Okt
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.decomposition import PCA

MODEL_DIR = "./ai_model/versions"
CSV_FILE_PATH = "./ai_model/output_with_price_category.csv"
CATEGORY_POP_FILE_PATH = "./ai_model/category_popularity.csv"

def get_data_hash(file_path):
    with open(file_path, 'rb') as f:
        return hashlib.md5(f.read()).hexdigest()
    
def multi_hot_encode_industry(df, industry_col="INDUSTRY"):
    all_industries = set()
    for inds in df[industry_col].dropna():
        inds_list = [i.strip() for i in inds.split(',')]
        all_industries.update(inds_list)
        
    all_industries = sorted(list(all_industries))
    
    for ind in all_industries:
        col_name = "IND_" + re.sub(r"\W+", "", ind)
        df[col_name] = df[industry_col].apply(lambda x: 1 if (pd.notna(x) and ind in [i.strip() for i in x.split(',')]) else 0)
        
    return df, all_industries

def preprocess_title(text):
    if pd.isna(text):
        return ""
    okt = Okt()
    tokens = okt.morphs(text)
    return " ".join(tokens)

def train_new_model():
    current_hash_main = get_data_hash(CSV_FILE_PATH)
    current_hash_catpop = get_data_hash(CATEGORY_POP_FILE_PATH)
    cat_pop_df = pd.read_csv(CATEGORY_POP_FILE_PATH, encoding='utf-8')
    
    if "CATEGORY_POPULARITY" in cat_pop_df.columns:
        cat_pop_df.rename(columns={"CATEGORY_POPULARITY": "CATEGORY_POPULARITY_SCORE"}, inplace=True)
    else:
        print("오류: 'CATEGORY_POPULARITY' 컬럼이 없습니다.")
        
    df = pd.read_csv(CSV_FILE_PATH, encoding='utf-8')
    
    if "CATEGORY_POPULARITY_SCORE" in df.columns:
        df.drop(columns=["CATEGORY_POPULARITY_SCORE"], inplace=True)
        
    df = df.merge(cat_pop_df, on="CATEGORY", how="left")
    print("데이터프레임 컬럼:", df.columns.tolist())
    
    if "CATEGORY_POPULARITY_SCORE" not in df.columns:
        df["CATEGORY_POPULARITY_SCORE"] = 0
    else:
        df["CATEGORY_POPULARITY_SCORE"] = df["CATEGORY_POPULARITY_SCORE"].fillna(0)
        
    if 'POPULARITY_SCORE' not in df.columns:
        df['POPULARITY_SCORE'] = (df['VIEWS'] * 0.7 + df['LIKES'] * 0.3).astype(int)
        
    if 'POST_MONTH' not in df.columns:
        df['POST_DATE'] = pd.to_datetime(df['POST_DATE'], errors='coerce')
        df['POST_MONTH'] = df['POST_DATE'].dt.month
        
    if 'INDUSTRY_COUNT' not in df.columns:
        df['INDUSTRY_COUNT'] = df['INDUSTRY'].apply(lambda x: len(x.split(',')) if pd.notna(x) else 0)
    
    df, all_industries = multi_hot_encode_industry(df, industry_col="INDUSTRY")
    
    cat_encoder = LabelEncoder()
    cond_encoder = LabelEncoder()
    pricecat_encoder = LabelEncoder()
    
    df['CATEGORY_enc'] = cat_encoder.fit_transform(df['CATEGORY'].astype(str))
    df['PRODUCT_CONDITION_enc'] = cond_encoder.fit_transform(df['PRODUCT_CONDITION'].astype(str))
    df['PRICE_CATEGORY_enc'] = pricecat_encoder.fit_transform(df['PRICE_CATEGORY'].astype(str))
    industry_cols = ["IND_" + re.sub(r"\W+", "", ind) for ind in all_industries]
    
    df['TITLE_processed'] = df['TITLE'].astype(str).apply(preprocess_title)
    
    vectorizer = TfidfVectorizer(max_features=10000)
    tfidf_matrix = vectorizer.fit_transform(df['TITLE_processed'])
    
    pca = PCA(n_components=50)
    tfidf_reduced = pca.fit_transform(tfidf_matrix.toarray())
    
    pca_columns = [f"TITLE_PCA_{i}" for i in range(tfidf_reduced.shape[1])]
    df_pca = pd.DataFrame(tfidf_reduced, columns=pca_columns, index=df.index)
    df = pd.concat([df, df_pca], axis=1)
    
    X_cols = industry_cols + [
        'CATEGORY_enc',
        'PRODUCT_CONDITION_enc',
        'POPULARITY_SCORE',
        'CATEGORY_POPULARITY_SCORE',
        'POST_MONTH',
        'PRICE_CATEGORY_enc',
        'INDUSTRY_COUNT'
    ] + pca_columns
    
    X = df[X_cols].copy()
    y = df['PRICE'].copy()
    X = X.fillna(0)
    y = y.fillna(y.mean())
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    model = XGBRegressor(
        n_estimators=300,
        max_depth=8,
        learning_rate=0.05,
        subsample=0.8,
        colsample_bytree=0.8,
        reg_alpha=0.2,
        reg_lambda=1.5,
        random_state=42,
        n_jobs=-1
    )
    try:
        model.fit(X_train, y_train, eval_set=[(X_test, y_test)], early_stopping_rounds=10, verbose=True)
    except TypeError as e:
        model.fit(X_train, y_train)
        
    y_pred = model.predict(X_test)
    
    mse = mean_squared_error(y_test, y_pred)
    rmse = np.sqrt(mse)
    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    
    print("모델 평가 결과")
    print(f"  - RMSE: {rmse:,.2f}")
    print(f"  - MAE : {mae:,.2f}")
    print(f"  - R2  : {r2:,.4f}")
    
    version_id = datetime.now().strftime("%Y%m%d-%H%M%S")
    save_path = os.path.join(MODEL_DIR, f"v{version_id}")
    os.makedirs(save_path, exist_ok=True)
    
    joblib.dump(model, os.path.join(save_path, 'price_model.joblib'))
    joblib.dump(cat_encoder, os.path.join(save_path, 'category_encoder.joblib'))
    joblib.dump(cond_encoder, os.path.join(save_path, 'condition_encoder.joblib'))
    joblib.dump(pricecat_encoder, os.path.join(save_path, 'price_cat_encoder.joblib'))
    joblib.dump(all_industries, os.path.join(save_path, 'industry_labels.joblib'))
    joblib.dump({"main_csv_hash": current_hash_main, "catpop_csv_hash": current_hash_catpop}, os.path.join(save_path, 'data_hash.joblib'))
    
    joblib.dump(vectorizer, os.path.join(save_path, 'title_vectorizer.joblib'))
    joblib.dump(pca, os.path.join(save_path, 'title_pca.joblib'))
    
    joblib.dump(X_cols, os.path.join(save_path, 'feature_columns.joblib'))
    
    with open(os.path.join(MODEL_DIR, 'LATEST'), 'w', encoding='utf-8') as f:
        f.write(version_id)
        
    print(f"\n모델 버전 v{version_id} 저장 완료: {save_path}")

if __name__ == "__main__":
    train_new_model()
