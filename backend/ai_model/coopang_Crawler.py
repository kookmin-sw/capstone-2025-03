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

DRIVE_CSV_PATH = "coupang_all_categories.csv"

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

class CoupangCrawler:
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
        self.session.mount("http://", adapter)

        self.processed_urls = set()
        self.df_lock = threading.Lock()
        self.url_lock = threading.Lock()
        self.ua = UserAgent()
        self.retry_limit = 3

        self.request_count = 0
        self.sleep_threshold = 600 
        self.big_sleep_time = 600 

    def _get_random_delay(self):
        return random.uniform(1, 3)

    def _rotate_user_agent(self):
        return self.ua.random

    def _crawl_item_detail(self, product_url: str) -> dict:
        for attempt in range(self.retry_limit):
            try:
                self.request_count += 1

                if self.request_count % self.sleep_threshold == 0:
                    print(f"{self.big_sleep_time}초 동안 대기 (차단 방지)")
                    time.sleep(self.big_sleep_time)

                headers = {
                    "User-Agent": self._rotate_user_agent(),
                    "Referer": "http://www.coupang.com",
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                    "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
                }
                full_url = urllib.parse.urljoin("http://www.coupang.com", product_url)
                resp = self.session.get(full_url, headers=headers, timeout=10)

                if resp.status_code == 403:
                    print(f"🚨 차단 감지(403)! 10초 대기 후 재시도...")
                    time.sleep(10)
                    continue
                elif resp.status_code == 404:
                    print(f"🚨 404 Not Found! 10초 대기 후 재시도...")
                    time.sleep(10)
                    continue

                resp.raise_for_status()
                soup = BeautifulSoup(resp.text, "html.parser")

                title_tag = soup.find("h2", class_="prod-buy-header__title")
                if not title_tag:
                    title_tag = soup.find("h2", class_="prod-title")
                title = title_tag.get_text(strip=True) if title_tag else "제목없음"

                price_tag = soup.find("span", class_="total-price")
                if price_tag:
                    price_text = price_tag.get_text(strip=True)
                    price = re.sub(r"[^\d]", "", price_text)
                else:
                    price = None

                sold_out = False
                if soup.find(string=re.compile("품절")):
                    sold_out = True
                condition = "품절" if sold_out else "새상품"

                posted_str = "알수없음"
                view_count = "알수없음"
                like_count = 0
                delivery = not sold_out
                quality = 3

                return {
                    "모델명": title,
                    "가격": price,
                    "상품상태": condition,
                    "게시일": posted_str,
                    "조회수": view_count,
                    "좋아요수": like_count,
                    "판매완료여부": sold_out,
                    "배송가능": delivery,
                    "품질등급": quality
                }
            except Exception as e:
                print(f"🚨 상세 URL={product_url} 시도 {attempt+1}/{self.retry_limit} 실패: {e}")
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

    def _process_item(self, item, keyword: str, industry: str):
        product_url = item.get("url")
        with self.url_lock:
            if product_url in self.processed_urls:
                return False
            self.processed_urls.add(product_url)

        with self.df_lock:
            if len(self.df_total[self.df_total['업종'] == industry]) >= self.min_per_industry:
                return False

        detail_data = self._crawl_item_detail(product_url)

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
                self.request_count += 1

                if self.request_count % self.sleep_threshold == 0:
                    print(f"{self.big_sleep_time}초 동안 대기 (차단 방지)")
                    time.sleep(self.big_sleep_time)

                search_url = f"http://www.coupang.com/np/search?component=&q={urllib.parse.quote(keyword)}&page={page}"
                headers = {
                    "User-Agent": self._rotate_user_agent(),
                    "Referer": "http://www.coupang.com",
                }
                resp = self.session.get(search_url, headers=headers, timeout=10000)

                if resp.status_code == 403:
                    print(f"🚨 차단 감지(403)! 10초 대기 후 재시도...")
                    time.sleep(10)
                    continue
                elif resp.status_code == 404:
                    print(f"🚨 404 Not Found! 10초 대기 후 재시도...")
                    time.sleep(10)
                    continue

                resp.raise_for_status()
                soup = BeautifulSoup(resp.text, "html.parser")

                items = []
                for li in soup.find_all("li", class_=re.compile("search-product")):
                    a_tag = li.find("a", href=re.compile("^/vp/products/"))
                    if a_tag:
                        product_url = a_tag.get("href")
                        items.append({"url": product_url})

                if not items:
                    print(f"🚨 [{keyword}] 페이지 {page}에서 상품을 찾지 못함")
                    break

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
            print(f"✅ [{industry}] '{keyword}' 수집 완료: {len(self.df_total[self.df_total['업종'] == industry])}건")

    def run(self):
        print("🚀 쿠팡 데이터 수집 시작")
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
    crawler = CoupangCrawler(min_per_industry=10, categories_file="categories.txt")
    crawler.run()
    crawler.save_csv(DRIVE_CSV_PATH)
