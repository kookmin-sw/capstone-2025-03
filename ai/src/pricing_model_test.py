import sys
import os
import joblib
import numpy as np
import re
from google.colab import drive
from sklearn.preprocessing import LabelEncoder

drive.mount('/content/drive')

MODEL_VERSION_DIR = "/content/drive/MyDrive/ai_model/versions"
try:
    with open(os.path.join(MODEL_VERSION_DIR, 'LATEST'), 'r') as f:
        latest_version = f.read().strip()
    latest_dir = os.path.join(MODEL_VERSION_DIR, f"v{latest_version}")
except Exception as e:
    print(f"모델 버전 로딩 오류: {e}")
    sys.exit(1)

try:
    price_model = joblib.load(os.path.join(latest_dir, 'price_model.joblib'))
    sales_model = joblib.load(os.path.join(latest_dir, 'sales_model.joblib'))
    encoders = joblib.load(os.path.join(latest_dir, 'encoders.joblib'))
    median_view_dict = joblib.load(os.path.join(latest_dir, 'median_view_dict.joblib'))
except Exception as e:
    print(f"모델 로딩 오류: {e}")
    sys.exit(1)

def enhanced_safe_transform(encoder, value):
    value = str(value).lower().strip()
    if not value:
        return -1
    if hasattr(encoder, "classes_"):
        if value in encoder.classes_:
            return encoder.transform([value])[0]
        return int(np.median(np.arange(len(encoder.classes_))))
    else:
        return encoder.transform([value])[0]

def refine_model_name(model_name, keyword):
    return re.sub(re.escape(keyword), '', model_name, flags=re.IGNORECASE).strip()

def predict_item(category, keyword, model_name, condition, quantity=1):
    try:
        category = str(category).lower().strip() or 'unknown'
        keyword = str(keyword).lower().strip() or category
        model_name = str(model_name).lower().strip() or 'general'
        condition = str(condition).lower().strip() or '중고'
        quantity = max(1, int(quantity))
        
        model_name = refine_model_name(model_name, keyword)
        k_enc = enhanced_safe_transform(encoders['keyword'], keyword)
        u_enc = enhanced_safe_transform(encoders['upjong'], category)
        m_enc = enhanced_safe_transform(encoders['model'], model_name)
        c_enc = enhanced_safe_transform(encoders['condition'], condition)
        
        view_count_input = median_view_dict.get(category, 0)
        price_pred = price_model.predict([[k_enc, u_enc, m_enc, c_enc]])[0]
        sales_pred = sales_model.predict([[k_enc, u_enc, m_enc, c_enc, price_pred, view_count_input ]])[0]
        return {
            '단가': int(price_pred),
            '총가격': int(price_pred * quantity),
            '판매확률': f"{min(max(sales_pred * 100, 0), 100):.1f}%",
            '추천가격대': f"{int(price_pred * 0.8):,} ~ {int(price_pred * 1.2):,}원"
        }
    except Exception as e:
        print(f"예측 오류: {str(e)}")
        return None

if __name__ == "__main__":
    print("중고거래 가격 예측 테스트")
    while True:
        try:
            category  = input("\n업종 입력 (예: 전자제품): ").strip()
            keyword  = input("키워드 입력 (생략 가능): ").strip()
            model_name  = input("모델명 입력: ").strip()
            condition  = input("상태 입력 (예: 새상품, 중고): ").strip()
            quantity  = input("수량 입력 (기본 1): ").strip()
            
            result = predict_item(
                category or 'unknown',
                keyword or category,
                model_name or 'general',
                condition or '중고',
                quantity or 1
            )
            
            if result:
                print("\n예측 결과:")
                print(f"• 예상 단가: {result['단가']:,}원")
                print(f"• 총 예상 금액: {result['총가격']:,}원")
                print(f"• 판매 성공 확률: {result['판매확률']}")
                print(f"• 추천 가격 범위: {result['추천가격대']}")
            
        except KeyboardInterrupt:
            print("\n프로그램을 종료합니다.")
            break
        if input("\n다시 예측하시겠습니까? (y/n): ").lower() != 'y':
            print("종료합니다.")
            break
