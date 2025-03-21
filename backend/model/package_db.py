import pandas as pd
import random
import csv

# 추천 키워드 매핑 (업종별 창업에 필요한 물품을 고려)
recommended_map = {
    "음식": ["가스레인지", "조리대", "프라이팬", "냉장고", "주방"],
    "배달": ["포장", "택배", "배달"],
    "카페": ["커피", "에스프레소", "머신", "휘핑기", "커피머신"],
    "제과": ["오븐", "베이킹", "몰드", "케이크"],
    "디저트": ["오븐", "베이킹", "몰드", "케이크", "디저트"],
    "스마트스토어/쇼핑몰": ["포장", "배송", "진열"],
    "무인 창업": ["키오스크", "네온사인", "무인"],
    "편의점": ["계산대", "진열", "냉장고"],
    "미용": ["미용", "드라이기", "거울", "의자"],
    "뷰티": ["메이크업", "립스틱", "틴트", "화장대"],
    "네일": ["네일"],
    "스터디카페": ["의자", "책상", "TV", "조명"],
    "학원/교육": ["책상", "의자", "화이트보드"],
    "애견샵/반려동물": ["케이지", "강아지", "애견"],
    "숙박업": ["침대", "매트리스", "커튼", "이불"],
    "레저": ["레저", "스포츠"],
    "오락": ["오락", "TV", "게임"],
    "스크린": ["스크린", "프로젝터"],
    "헬스장": ["런닝머신", "덤벨", "바벨", "헬스"],
    "레슨샵": ["악기", "음향", "스피커"],
    "유통업": ["진열", "바코드", "포장"],
    "스타트업": ["컴퓨터", "네트워크", "프린터"],
    "1인기업": ["컴퓨터", "네트워크", "프린터"],
    "노점": ["푸드트럭", "포장"],
    "푸드트럭": ["푸드트럭"],
    "사업": ["사무용", "회의", "책상"],
    "해외장사": ["수출", "무역"],
    "전문서비스": ["서비스"],
    "기술창업": ["기술"]
}

# 1. 업종 데이터 (industries_industry.csv의 내용)
industries_data = [
    {"id": 1, "name": "음식"},
    {"id": 2, "name": "배달"},
    {"id": 3, "name": "카페"},
    {"id": 4, "name": "제과"},
    {"id": 5, "name": "디저트"},
    {"id": 6, "name": "스마트스토어/쇼핑몰"},
    {"id": 7, "name": "무인 창업"},
    {"id": 8, "name": "편의점"},
    {"id": 9, "name": "미용"},
    {"id": 10, "name": "뷰티"},
    {"id": 11, "name": "네일"},
    {"id": 12, "name": "스터디카페"},
    {"id": 13, "name": "학원/교육"},
    {"id": 14, "name": "애견샵/반려동물"},
    {"id": 15, "name": "숙박업"},
    {"id": 16, "name": "레저"},
    {"id": 17, "name": "오락"},
    {"id": 18, "name": "스크린"},
    {"id": 19, "name": "헬스장"},
    {"id": 20, "name": "레슨샵"},
    {"id": 21, "name": "유통업"},
    {"id": 22, "name": "스타트업"},
    {"id": 23, "name": "1인기업"},
    {"id": 24, "name": "노점"},
    {"id": 25, "name": "푸드트럭"},
    {"id": 26, "name": "사업"},
    {"id": 27, "name": "해외장사"},
    {"id": 28, "name": "전문서비스"},
    {"id": 29, "name": "기술창업"}
]
industries_df = pd.DataFrame(industries_data)

# 2. 카테고리-업종 매핑 및 카테고리 정보 읽기
cat_industry_df = pd.read_csv("./db/categories_category_industry_ids.csv")
cat_industry_df['category_id'] = cat_industry_df['category_id'].astype(int)
cat_industry_df['industry_id'] = cat_industry_df['industry_id'].astype(int)

categories_df = pd.read_csv("./db/categories_category.csv")
categories_df['id'] = categories_df['id'].astype(int)

# 카테고리 id -> 이름 딕셔너리 생성
category_info = categories_df.set_index("id")["name"].to_dict()

# 3. 제품 데이터 읽기
products_df = pd.read_csv("./db/products_product.csv")
products_df['category_id_id'] = products_df['category_id_id'].astype(int)
products_df['price'] = pd.to_numeric(products_df['price'], errors='coerce')

# 4. 각 업종별로 3개의 패키지 생성
package_rows = []

for _, industry in industries_df.iterrows():
    industry_id = industry['id']
    industry_name = industry['name']
    
    # 해당 업종에서 사용할 수 있는 카테고리 id 추출
    allowed_categories = cat_industry_df[cat_industry_df['industry_id'] == industry_id]['category_id'].unique().tolist()
    
    # 제품이 존재하는 카테고리만 필터링
    available_categories = []
    for cat in allowed_categories:
        if not products_df[products_df['category_id_id'] == cat].empty:
            available_categories.append(cat)
    
    # 사용 가능한 카테고리가 없으면 이번 업종은 스킵
    if len(available_categories) == 0:
        continue
    
    # 업종별 추천 키워드 가져오기
    recommended_keywords = recommended_map.get(industry_name, [])
    
    # 사용 가능한 카테고리를 추천 후보와 기타 후보로 분리
    rec_candidates = []
    other_candidates = []
    for cat in available_categories:
        cat_name = category_info.get(cat, "")
        if any(keyword in cat_name for keyword in recommended_keywords):
            rec_candidates.append(cat)
        else:
            other_candidates.append(cat)
    
    # 추천 우선 방식으로 3개의 카테고리 선택 함수
    def select_categories():
        selected = []
        if len(rec_candidates) >= 3:
            selected = random.sample(rec_candidates, 3)
        else:
            selected = rec_candidates.copy()
            needed = 3 - len(selected)
            if len(other_candidates) >= needed:
                selected += random.sample(other_candidates, needed)
            else:
                selected += other_candidates  # available_categories 전체 개수가 3 미만일 경우
        return selected
    
    # 각 업종당 3개의 패키지 생성
    for package_number in range(1, 4):
        package_name = f"{industry_name} 창업 패키지 {package_number}"
        
        selected_categories = select_categories()
        # 만약 3개 미만이면 나머지는 available_categories에서 추가 (중복되지 않게)
        if len(selected_categories) < 3:
            remaining = list(set(available_categories) - set(selected_categories))
            while len(selected_categories) < 3 and remaining:
                selected_categories.append(random.choice(remaining))
                remaining = list(set(available_categories) - set(selected_categories))
        
        # 각 카테고리별 제품 선택 (각 카테고리당 1~2개 제품)
        selected_product_ids = []
        total_price = 0
        
        # 각 카테고리에 대해 제품 선택
        for cat_id in selected_categories:
            products_in_cat = products_df[products_df['category_id_id'] == cat_id]
            # 만일 제품이 없을 경우(이론상 없으면 안되지만) 다른 카테고리로 재선정
            if products_in_cat.empty:
                alternatives = list(set(available_categories) - set(selected_categories))
                if alternatives:
                    new_cat = random.choice(alternatives)
                    selected_categories.append(new_cat)
                    products_in_cat = products_df[products_df['category_id_id'] == new_cat]
                    cat_id = new_cat
                else:
                    continue
            num_products = random.choice([1, 2])
            num_products = min(num_products, len(products_in_cat))
            chosen_products = products_in_cat.sample(n=num_products)
            for _, product in chosen_products.iterrows():
                selected_product_ids.append(str(product['id']))
                if pd.notnull(product['price']):
                    total_price += product['price']
        
        # 문자열 변환 시 구분자로 ", " 사용
        category_ids_str = ", ".join(map(str, selected_categories))
        product_ids_str = ", ".join(selected_product_ids)
        
        package_row = {
            "name": package_name,
            "industry_id": industry_id,
            "category_ids": category_ids_str,
            "product_ids": product_ids_str,
            "price": total_price,
            "thumbnail": "",
            "description": ""
        }
        package_rows.append(package_row)

packages_df = pd.DataFrame(package_rows)

# CSV 저장 시 모든 필드를 큰따옴표로 감싸서 Excel 등에서 과학적 표기법 문제를 방지
packages_df.to_csv("package.csv", index=False, quoting=csv.QUOTE_ALL)

print("package.csv 파일이 생성되었습니다.")
