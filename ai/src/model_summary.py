import pandas as pd

df = pd.read_csv('danawa_gas_range.csv', encoding='utf-8')

df['모델명'] = df['모델명'].astype(str).str.strip()

initial_count = len(df)
df = df[df['모델명'] != '']
after_drop = len(df)
print(f"원본 행 개수: {initial_count}, 빈 모델명 제거 후: {after_drop}")

df['가격'] = (
    df['가격']
    .astype(str)
    .str.replace('[^0-9]', '', regex=True)
    .astype(int)
)

count_df = df.groupby('모델명').size().reset_index(name='count')

price_df = (
    df
    .groupby('모델명')['가격']
    .agg(['mean', 'min', 'max'])
    .reset_index()
    .rename(columns={'mean':'avg_price', 'min':'min_price', 'max':'max_price'})
)

summary = pd.merge(count_df, price_df, on='모델명')
summary['avg_price'] = summary['avg_price'].round(0).astype(int)

total_grouped = summary['count'].sum()
print(f"그룹 합계: {total_grouped} (원본: {after_drop})")

summary.to_csv('gas_range_model_summary.csv', index=False, encoding='utf-8-sig')
print("✅ gas_range_model_summary.csv 생성 완료!")
