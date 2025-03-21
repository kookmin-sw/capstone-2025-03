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

DRIVE_CSV_PATH = "/content/drive/MyDrive/ai_model/joongna_all_categories.csv"

def load_categories_from_txt(filename="categories.txt"):
    categories = {}
    with open(filename, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            if "," in line:
                industry, keyword = line.split(",", 1)
                industry = industry.strip().lower()
                keyword = keyword.strip().lower()
                categories.setdefault(industry, []).append(keyword)
            else:
                categories.setdefault("기타", []).append(line.strip().lower())
    return categories

class JoongnaCrawler:
    def __init__(self, min_per_industry=10, categories_file="categories.txt"):
        self.categories_dict = load_categories_from_txt(categories_file)
        self.min_per_industry = min_per_industry
        self.df_total = pd.DataFrame(columns=[
            "키워드", "업종", "모델명", "가격", "상품상태",
            "게시일", "조회수", "좋아요수", "판매완료여부",
            "배송가능", "품질등급"
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

    def _crawl_item_detail(self, seq: int) -> dict:
        for attempt in range(self.retry_limit):
            try:
                headers = {
                    "User-Agent": self._rotate_user_agent(),
                    "Referer": f"https://web.joongna.com/product/{seq}",
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                    "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
                    "Accept-Encoding": "gzip, deflate, br",
                }
                detail_url = f"https://web.joongna.com/product/{seq}"
                resp = self.session.get(detail_url, headers=headers, timeout=10)
                if resp.status_code == 403:
                    print(f"🚨 차단 감지! {self._get_random_delay()*10:.1f}초 대기...")
                    time.sleep(self._get_random_delay() * 10)
                    continue
                resp.raise_for_status()
                soup = BeautifulSoup(resp.text, "html.parser")
                script_tag = soup.find("script", id="__NEXT_DATA__")
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
                        
                        title = product_data.get("productTitle") or product_data.get("title") or "제목없음"
                        price = product_data.get("productPrice") or product_data.get("price") or 0
                        cond_val = product_data.get("condition", {}).get("productCondition")
                        condition = "새상품" if cond_val == 0 else "중고"
                        
                        sort_date_str = product_data.get("sortDate") or product_data.get("updateDate") or product_data.get("createdAt")
                        posted_str = sort_date_str if sort_date_str else "알수없음"
                        
                        view_count = product_data.get("viewCount")
                        if view_count is None:
                            text = soup.get_text()
                            view_match = re.search(r"조회수\s*[:：]?\s*([\d,]+)", text)
                            view_count = view_match.group(1).replace(",", "") if view_match else "알수없음"
                        like_count = product_data.get("likeCount", 0)
                        sold = product_data.get("sold", False)
                        delivery = product_data.get("deliveryAvailable", False)
                        quality = product_data.get("quality", 3)
                        return {
                            "모델명": title,
                            "가격": price,
                            "상품상태": condition,
                            "게시일": posted_str,
                            "조회수": view_count,
                            "좋아요수": like_count,
                            "판매완료여부": sold,
                            "배송가능": delivery,
                            "품질등급": quality
                        }
                
                meta_title = soup.find("meta", property="og:title")
                title = meta_title.get("content") if meta_title and meta_title.get("content") else "제목없음"
                meta_pub = soup.find("meta", property="article:published_time")
                if meta_pub and meta_pub.get("content"):
                    posted_str = meta_pub.get("content")
                else:
                    text = soup.get_text()
                    date_match = re.search(r"(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})", text)
                    posted_str = date_match.group(1) if date_match else "알수없음"
                text = soup.get_text()
                view_match = re.search(r"조회수\s*[:：]?\s*([\d,]+)", text)
                view_count = view_match.group(1).replace(",", "") if view_match else "알수없음"
                condition_text = self._crawl_item_detail_html(seq)
                return {
                    "모델명": title,
                    "가격": None,
                    "상품상태": condition_text,
                    "게시일": posted_str,
                    "조회수": view_count,
                    "좋아요수": 0,
                    "판매완료여부": False,
                    "배송가능": False,
                    "품질등급": 3
                }
            except Exception as e:
                print(f"🚨 상세 seq={seq} 시도 {attempt+1}/{self.retry_limit} 실패: {e}")
                time.sleep(self._get_random_delay() * (attempt + 1))
        return {
            "모델명": "제목없음",
            "가격": None,
            "상품상태": "알수없음",
            "게시일": "알수없음",
            "조회수": "알수없음",
            "좋아요수": 0,
            "판매완료여부": False,
            "배송가능": False,
            "품질등급": 3
        }

    def _crawl_item_detail_html(self, seq: int) -> str:
        for attempt in range(self.retry_limit):
            try:
                headers = {
                    "User-Agent": self._rotate_user_agent(),
                    "Referer": f"https://web.joongna.com/product/{seq}",
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                    "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
                    "Accept-Encoding": "gzip, deflate, br",
                }
                detail_url = f"https://web.joongna.com/product/{seq}"
                resp = self.session.get(detail_url, headers=headers, timeout=10)
                if resp.status_code == 403:
                    print(f"🚨 차단 감지! {self._get_random_delay()*10:.1f}초 대기...")
                    time.sleep(self._get_random_delay() * 10)
                    continue
                resp.raise_for_status()
                soup = BeautifulSoup(resp.text, "html.parser")
                ul_elem = soup.find("ul", class_="box-border flex text-center border border-gray-300 rounded items-center py-6 mb-6")
                if not ul_elem:
                    return "알수없음"
                for li in ul_elem.find_all("li", recursive=False):
                    span = li.find("span")
                    btn = li.find("button")
                    if span and btn and "제품상태" in span.get_text(strip=True):
                        return btn.get_text(strip=True)
                return "알수없음"
            except Exception as e:
                print(f"🚨 상세 seq={seq} 시도 {attempt+1}/{self.retry_limit} 실패: {e}")
                time.sleep(self._get_random_delay() * (attempt + 1))
        return "알수없음"

    def _process_item(self, item, keyword: str, industry: str):
        seq = item.get("seq")
        with self.seq_lock:
            if seq in self.processed_seqs:
                return False
            self.processed_seqs.add(seq)
        with self.df_lock:
            if len(self.df_total[self.df_total['업종'] == industry]) >= self.min_per_industry:
                return False
        detail_data = self._crawl_item_detail(seq)
        time.sleep(self._get_random_delay())
        new_row = {"키워드": keyword, "업종": industry}
        new_row.update(detail_data)
        with self.df_lock:
            self.df_total = pd.concat([self.df_total, pd.DataFrame([new_row])], ignore_index=True)
        return True

    def _crawl_keyword(self, keyword: str, industry: str, target_count: int):
        max_page = 10
        page = 1
        while page <= max_page:
            with self.df_lock:
                if len(self.df_total[self.df_total['업종'] == industry]) >= self.min_per_industry:
                    break
            try:
                base_url = f"https://web.joongna.com/_next/data/t5L9ltsEKeOiG2yszdxxb/search/{urllib.parse.quote(keyword)}.json"
                params = {
                    "keyword": keyword,
                    "page": page,
                    "saleYn": "SALE_N",
                    "sort": "RECOMMEND_SORT",
                    "quantity": 80,
                }
                headers = {
                    "User-Agent": self._rotate_user_agent(),
                    "Referer": f"https://web.joongna.com/search/{urllib.parse.quote(keyword)}",
                }
                resp = self.session.get(base_url, params=params, headers=headers, timeout=15)
                resp.raise_for_status()
                data = resp.json()
                items = data["pageProps"]["dehydratedState"]["queries"][1]["state"]["data"]["data"]["items"]
                with ThreadPoolExecutor(max_workers=5) as executor:
                    futures = []
                    for item in items:
                        with self.df_lock:
                            if len(self.df_total[self.df_total['업종'] == industry]) >= self.min_per_industry:
                                break
                        futures.append(executor.submit(self._process_item, item, keyword, industry))
                    for future in as_completed(futures):
                        _ = future.result()
                page += 1
                time.sleep(self._get_random_delay())
            except Exception as e:
                print(f"🚨 [{keyword}] 페이지 {page} 오류: {e}")
                time.sleep(self._get_random_delay() * 2)
                continue

    def _crawl_industry(self, industry, keywords):
        for keyword in keywords:
            print(f"🔍 [{industry}] 키워드: {keyword}")
            self._crawl_keyword(keyword, industry, self.min_per_industry)
            print(f"✅ [{industry}] {keyword} 수집 완료: {len(self.df_total[self.df_total['업종'] == industry])}건")

    def run(self):
        print("🚀 중고나라 데이터 수집 시작")
        start_time = time.time()
        with ThreadPoolExecutor(max_workers=3) as executor:
            futures = []
            for industry, keywords in self.categories_dict.items():
                futures.append(executor.submit(self._crawl_industry, industry, keywords))
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
    crawler = JoongnaCrawler(min_per_industry=10, categories_file="categories.txt")
    crawler.run()
    crawler.save_csv(DRIVE_CSV_PATH)
