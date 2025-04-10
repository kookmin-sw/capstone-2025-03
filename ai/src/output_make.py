#!/usr/bin/env python
# -*- coding: utf-8 -*-
import pandas as pd
import re

def clean_model_name(name: str) -> str:
    cleaned = re.sub(r'[^\w\s가-힣]', '', name)
    cleaned = re.sub(r'\b삽니다\b', '', cleaned)
    cleaned = re.sub(r'\s+', ' ', cleaned).strip()
    return cleaned

def clean_description(text: str) -> str:
    if not isinstance(text, str):
        return text
    unwanted = [
        "상품 정보",
        "거래 전 주의사항",
        "중고나라 카페 상품입니다.",
        "거래를 원하실 경우",
        "채팅하기",
        "를 눌러주세요.",
        "※ 카페 상품 게시글은 자동으로 중고나라 앱/사이트에 노출합니다. 노출을 원하지 않으실 경우 고객센터로 문의 바랍니다.",
        "※ 등록한 게시글이 회원의 신고를 받거나 이상거래로 모니터링 될 경우 중고나라 사기통합조회 DB로 수집/활용될 수 있습니다.",
        "더보기",
        '오늘 작성가능한 게시글 수가 부족하다면, 상단에 "중고나라 앱 다운받기"를 통해서 앱에서 작성해 보세요!',
        '오늘 작성가능한 게시글 수가 부족하다면, 상단에 "중고나라 앱 다운받기"를 통해서 앱에서 작성해 주세요!',
        "더 보기",
        '중고나라 앱이 있다는 걸 아시나요? 상단 중고나라 앱 다운받기 클릭!',
        '앱에서 구매를 원하는 댓글이 달릴 수도 있어요!',
        '클릭하고 미리 알아두기!',
        '───────────────────',
        '※ 유튜브, 블로그, 인스타그램 등  제공 목적 링크 가능',
        '(외부 거래를 유도하는 링크 제외)',
        '👆',
        '사진 설명을 입력하세요.'
    ]
    for phrase in unwanted:
        text = text.replace(phrase, "")
    return text

def extract_price_from_text(text: str) -> str:
    if not isinstance(text, str):
        return None
    pattern = re.compile(r'(?:가격\s*[:：]?\s*|￦\s*)(\d{3,}(?:,\d{3})*)(?:\s*원)?')
    match = pattern.search(text)
    if match:
        return match.group(1).replace(',', '')
    return None

def correct_price(price_value, description: str) -> str:
    weird_prices = {"123123", "12345", "123456", "1234", "123"}
    price_str = str(price_value).strip()
    if price_str in weird_prices:
        extracted = extract_price_from_text(description)
        if extracted:
            return extracted
    return price_str

def fix_image_url(url: str) -> str:
    if not isinstance(url, str):
        return url
    if not url.startswith("https://img2.joongna.com"):
        if url.startswith("/"):
            return "https://img2.joongna.com" + url
        else:
            return "https://img2.joongna.com/" + url
    return url

CRAWL_CSV_PATH = "./joongna_all_categories_v2.csv"
CATEGORY_CSV_PATH = "./db/categories_category.csv"
OUTPUT_CSV_PATH = "output.csv"

df_crawl = pd.read_csv(CRAWL_CSV_PATH)

df_mapping = pd.read_csv(CATEGORY_CSV_PATH)

category_dict = df_mapping.set_index("name")["id"].to_dict()

df_crawl["category_id"] = df_crawl["키워드"].map(category_dict)

df_output = pd.DataFrame()
df_output["images"] = df_crawl["images"].apply(fix_image_url)

df_output["name"] = df_crawl["모델명"].apply(clean_model_name)

df_output["description"] = df_crawl["description"].apply(clean_description)
df_output["grade"] = df_crawl["상품상태"]
df_output["quantity"] = 1

df_output["price"] = df_crawl.apply(lambda row: correct_price(row["가격"], row["description"]), axis=1)
df_output["upload_date"] = df_crawl["게시일"]
df_output["purchase_date"] = None
df_output["sales_status"] = "available"
df_output["buyer_id"] = None
df_output["category_id"] = df_crawl["category_id"]
df_output["seller_id"] = None
df_output["origin_url"] = df_crawl["origin_url"]

df_output = df_output.sort_values(by="category_id", na_position="last").reset_index(drop=True)

df_output.insert(0, "id", range(1, len(df_output) + 1))

final_columns = ["id", "images", "name", "description", "grade", "quantity", 
                 "price", "upload_date", "purchase_date", "sales_status", 
                 "buyer_id", "category_id", "seller_id", "origin_url"]
df_output = df_output[final_columns]

df_output.to_csv(OUTPUT_CSV_PATH, index=False, encoding="utf-8-sig")
print(f"output.csv 파일이 생성되었습니다. 총 {len(df_output)}건의 데이터가 저장되었습니다.")
