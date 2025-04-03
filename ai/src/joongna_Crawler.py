#!/usr/bin/env python
# -*- coding: utf-8 -*-
import os
import re
import time
import random
import urllib.parse
import pandas as pd
import requests
from bs4 import BeautifulSoup
from concurrent.futures import ThreadPoolExecutor, as_completed
import threading
import json
from fake_useragent import UserAgent
from requests.adapters import HTTPAdapter
from datetime import datetime

DRIVE_CSV_PATH = "./joongna_all_categories_v3.csv"

def load_categories_from_txt(filename="categories.txt"):
    categories = {}
    with open(filename, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            tokens = [token.strip().lower() for token in line.split(",")]
            if len(tokens) < 2:
                categories.setdefault("기타", []).append(tokens[0])
            else:
                keyword = tokens[-1]
                industries = tokens[:-1]
                for industry in industries:
                    categories.setdefault(industry, []).append(keyword)
    return categories

def convert_english_to_upper(text: str) -> str:
    return re.sub(r'[a-zA-Z]+', lambda m: m.group(0).upper(), text)

class JoongnaCrawler:
    def __init__(self, target_per_keyword=20, categories_file="categories.txt"):
        self.categories_dict = load_categories_from_txt(categories_file)
        self.target_per_keyword = target_per_keyword
        self.df_total = pd.DataFrame(columns=[
            "키워드", "업종", "모델명", "가격", "상품상태",
            "게시일", "조회수", "좋아요수", "판매완료여부",
            "배송가능", "품질등급", "images", "description", "origin_url"
        ])
        self.session = requests.Session()
        adapter = HTTPAdapter(pool_connections=100, pool_maxsize=100)
        self.session.mount("http://", adapter)
        self.session.mount("https://", adapter)
        self.processed_seqs = set()
        self.df_lock = threading.Lock()
        self.seq_lock = threading.Lock()
        self.ua = UserAgent()
        self.retry_limit = 3

    def _get_random_delay(self):
        return random.uniform(1, 3)
    
    def _rotate_user_agent(self):
        return self.ua.random

    def _crawl_item_detail_html_fallback(self, seq: int) -> dict:
        url = f"https://web.joongna.com/product/{seq}"
        headers = {
            "User-Agent": self._rotate_user_agent(),
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
        }
        try:
            resp = self.session.get(url, headers=headers, timeout=10)
            resp.raise_for_status()
            soup = BeautifulSoup(resp.text, "html.parser")
            status = ""
            ul_elem = soup.find("ul", class_="box-border flex text-center border border-gray-300 rounded items-center py-6 mb-6")
            if ul_elem:
                for li in ul_elem.find_all("li", recursive=False):
                    span = li.find("span")
                    btn = li.find("button")
                    if span and btn:
                        txt = span.get_text(strip=True)
                        if "제품상태" in txt:
                            status = btn.get_text(strip=True)
                            break
            else:
                print(f"DEBUG: ul 요소를 찾지 못함 for seq={seq}")
            desc_div = soup.find("div", {"name": "product-description"})
            description = desc_div.get_text("\n", strip=True) if desc_div else ""
            if not desc_div:
                print(f"DEBUG: product-description div를 찾지 못함 for seq={seq}")
            meta_title = soup.find("meta", property="og:title")
            if meta_title and meta_title.has_attr("content"):
                title = meta_title["content"]
            else:
                h1_elem = soup.find("h1")
                title = h1_elem.get_text(strip=True) if h1_elem else ""
            return {"모델명": title, "상품상태": status, "description": description}
        except Exception as e:
            print(f"🚨 HTML fallback 파싱 실패 for seq={seq}: {e}")
            return {"모델명": "", "상품상태": "", "description": ""}

    def _crawl_item_detail(self, seq: int, keyword: str) -> dict:
        for attempt in range(self.retry_limit):
            try:
                headers = {
                    "User-Agent": self._rotate_user_agent(),
                    "Referer": f"https://web.joongna.com/product/{seq}",
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                }
                detail_url = f"https://web.joongna.com/product/{seq}"
                resp = self.session.get(detail_url, headers=headers, timeout=10)
                if resp.status_code == 403:
                    print(f"🚨 상세 {seq} 차단 감지! 대기 중...")
                    time.sleep(self._get_random_delay() * 10)
                    continue
                resp.raise_for_status()
                soup = BeautifulSoup(resp.text, "html.parser")
                script_tag = soup.find("script", id="__NEXT_DATA__")
                product_data = None
                if script_tag:
                    data = json.loads(script_tag.string)
                    product_data = data.get("props", {}).get("pageProps", {}).get("product", None)
                    if not product_data:
                        dehydrated = data.get("props", {}).get("pageProps", {}).get("dehydratedState", {})
                        queries = dehydrated.get("queries", [])
                        for query in queries:
                            query_key = query.get("queryKey", [])
                            if isinstance(query_key, list) and "product" in query_key and "detail" in query_key:
                                product_data = query.get("state", {}).get("data", {}).get("data")
                                break
                if product_data:
                    model_name = product_data.get("productTitle") or product_data.get("title") or "제목없음"
                    price = product_data.get("productPrice") or product_data.get("price") or 0
                    cond_val = product_data.get("condition", {}).get("productCondition")
                    try:
                        cond_int = int(cond_val) if cond_val is not None else None
                    except Exception:
                        cond_int = None
                    condition = "새상품" if cond_int == 0 else "중고" if cond_int is not None else "알수없음"
                    posted_str = product_data.get("sortDate") or product_data.get("updateDate") or product_data.get("createdAt") or "알수없음"
                    view_count = product_data.get("viewCount", "알수없음")
                    like_count = product_data.get("likeCount", 0)
                    sold = product_data.get("sold", False)
                    delivery = product_data.get("deliveryAvailable", False)
                    quality = product_data.get("quality", 3)
                    
                    images = product_data.get("productImages") or product_data.get("images")
                    if not images and product_data.get("media"):
                        media = product_data.get("media")
                        if isinstance(media, list):
                            images = [m.get("originUrl", "") for m in media if m.get("originUrl")]
                    if isinstance(images, list):
                        images = ",".join(images)
                    elif not images:
                        images = ""
                    
                    description = product_data.get("productDescription") or product_data.get("description") or ""
                    product_status = product_data.get("productStatus")
                    if (not description or not product_status) or (str(product_status).lower() == "unknown"):
                        fallback = self._crawl_item_detail_html_fallback(seq)
                        if fallback.get("description"):
                            description = fallback["description"]
                        if fallback.get("상품상태"):
                            product_status = fallback["상품상태"]
                            
                    if model_name.endswith("..."):
                        fallback = self._crawl_item_detail_html_fallback(seq)
                        if fallback.get("모델명"):
                            model_name = fallback.get("모델명")
                    
                    if description:
                        paragraphs = description.split("\n")
                        filtered_paragraphs = [p for p in paragraphs if "📢" not in p and "🚨" not in p]
                        description = "\n".join(filtered_paragraphs)
                    
                    detail_info = {
                        "모델명": model_name,
                        "가격": price,
                        "상품상태": product_status if product_status else condition,
                        "게시일": posted_str,
                        "조회수": view_count,
                        "좋아요수": like_count,
                        "판매완료여부": sold,
                        "배송가능": delivery,
                        "품질등급": quality,
                        "images": images,
                        "description": description,
                        "origin_url": detail_url
                    }
                    return detail_info
                else:
                    print(f"🚨 상품 데이터 없음 for seq={seq}")
                    return {}
            except Exception as e:
                print(f"🚨 상세 seq={seq} 시도 {attempt+1}/{self.retry_limit} 실패: {e}")
                time.sleep(self._get_random_delay() * (attempt + 1))
        return {}

    def _process_item(self, item, keyword: str, industry: str):
        seq = item.get("seq")
        if not seq:
            return False
        with self.seq_lock:
            if seq in self.processed_seqs:
                return False
            self.processed_seqs.add(seq)
        detail_data = self._crawl_item_detail(seq, keyword)
        time.sleep(self._get_random_delay())
        if not detail_data:
            return False
        new_row = {
            "키워드": keyword,
            "업종": industry
        }
        new_row.update(detail_data)
        with self.df_lock:
            if len(self.df_total[self.df_total['키워드'] == keyword]) >= self.target_per_keyword:
                return False
            self.df_total = pd.concat([self.df_total, pd.DataFrame([new_row])], ignore_index=True)
        return True

    def _crawl_keyword(self, keyword: str, industry: str, target_count: int):
        if keyword.strip() == "쇼파 / 테이블":
            processed_keyword = "쇼파, 테이블"
            search_keyword = "쇼파 테이블"
        else:
            processed_keyword = convert_english_to_upper(keyword)
            search_keyword = processed_keyword
            if "/" in search_keyword:
                search_keyword = re.sub(r'\s*/\s*', ' ', search_keyword)
        max_page = 10
        page = 1
        while page <= max_page:
            with self.df_lock:
                if len(self.df_total[self.df_total['키워드'] == processed_keyword]) >= target_count:
                    break
            token = self._get_next_data_token()
            if not token:
                print("🚨 토큰을 가져오지 못했습니다")
                break
            base_url = f"https://web.joongna.com/_next/data/{token}/search/{urllib.parse.quote(search_keyword)}.json"
            params = {
                "keyword": search_keyword,
                "page": page,
                "saleYn": "SALE_N",
                "sort": "RECOMMEND_SORT",
                "quantity": 20,
            }
            headers = {
                "User-Agent": self._rotate_user_agent(),
                "Referer": f"https://web.joongna.com/search/{urllib.parse.quote(search_keyword)}",
            }
            try:
                resp = self.session.get(base_url, params=params, headers=headers, timeout=15)
                resp.raise_for_status()
                data = resp.json()
                queries = data.get("pageProps", {}).get("dehydratedState", {}).get("queries", [])
                items = []
                for query in queries:
                    query_key = query.get("queryKey", [])
                    if isinstance(query_key, list) and any("get-search-products" in str(k).lower() for k in query_key):
                        items = query.get("state", {}).get("data", {}).get("data", {}).get("items", [])
                        break
                print(f"DEBUG: 키워드 '{processed_keyword}' (검색용: '{search_keyword}') 페이지 {page}에서 항목 개수: {len(items)}")
                if not items:
                    break
                with ThreadPoolExecutor(max_workers=5) as executor:
                    futures = []
                    for item in items:
                        with self.df_lock:
                            if len(self.df_total[self.df_total['키워드'] == processed_keyword]) >= target_count:
                                break
                        futures.append(executor.submit(self._process_item, item, processed_keyword, industry))
                    for future in as_completed(futures):
                        _ = future.result()
                page += 1
                time.sleep(self._get_random_delay())
            except Exception as e:
                print(f"🚨 [{processed_keyword}] 페이지 {page} 오류: {e}")
                time.sleep(self._get_random_delay() * 2)
                continue

    def _get_next_data_token(self) -> str:
        url = "https://web.joongna.com"
        headers = {"User-Agent": self._rotate_user_agent()}
        try:
            resp = self.session.get(url, headers=headers, timeout=10)
            resp.raise_for_status()
            soup = BeautifulSoup(resp.text, "html.parser")
            script_tag = soup.find("script", id="__NEXT_DATA__")
            if script_tag:
                data = json.loads(script_tag.string)
                token = data.get("buildId", "")
                print(f"DEBUG: 추출된 buildId(token): {token}")
                return token
            return ""
        except Exception as e:
            print("🚨 토큰 가져오기 실패:", e)
            return ""

    def run(self):
        print("🚀 중고나라 데이터 수집 시작")
        start_time = time.time()
        unique_keywords = {}
        for industry, keywords in self.categories_dict.items():
            for keyword in keywords:
                if keyword in unique_keywords:
                    unique_keywords[keyword].add(industry)
                else:
                    unique_keywords[keyword] = {industry}
        with ThreadPoolExecutor(max_workers=3) as executor:
            futures = []
            for keyword, industries in unique_keywords.items():
                industry_str = ", ".join(sorted(industries))
                futures.append(executor.submit(self._crawl_keyword, keyword, industry_str, self.target_per_keyword))
            for future in as_completed(futures):
                try:
                    future.result()
                except Exception as e:
                    print(f"🚨 예외 발생: {e}")
        elapsed = time.time() - start_time
        print(f"⏱️ 총 소요 시간: {elapsed:.2f}초")
        print(f"📊 전체 수집 건수: {len(self.df_total)}건")

    def save_csv(self, filename):
        self.df_total.to_csv(filename, index=False, encoding="utf-8-sig")
        print(f"🎉 저장 완료: {filename}, 총 {len(self.df_total)}건")

if __name__ == "__main__":
    crawler = JoongnaCrawler(target_per_keyword=20, categories_file="categories.txt")
    crawler.run()
    crawler.save_csv(DRIVE_CSV_PATH)
