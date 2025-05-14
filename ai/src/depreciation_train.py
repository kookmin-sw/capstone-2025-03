import random
import pandas as pd
import torch
from torch.utils.data import Dataset
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error
from transformers import (
    AutoTokenizer,
    AutoModelForSequenceClassification,
    Trainer,
    TrainingArguments
)

def prepare_dataset(
    input_csv: str = "danawa_gas_range.csv",
    output_csv: str = "depreciation_data.csv"
):
    df = pd.read_csv(input_csv)

    df['가격'] = (
        df['가격']
        .str.replace(',', '')
        .str.replace('원', '')
        .astype(int)
    )
    df['카테고리'] = '가스레인지'

    usage_phrases = [
        ("1개월 사용", 0.2), ("6개월 사용", 0.5),
        ("1년 사용", 1.0), ("2년 사용", 2.0),
        ("3년 사용", 3.0), ("4년 사용", 4.0),
        ("5년 사용", 5.0), ("거의 사용하지 않음", 0.5)
    ]
    condition_phrases = [
        ("상태 최상", -0.05), ("상태 양호", 0.0),
        ("상태 보통", 0.03), ("사용감 있음", 0.05),
        ("생활흔적 있음", 0.05), ("외관 약간 흠집", 0.04),
        ("외관 심한 흠집", 0.1)
    ]
    damage_phrases = [
        ("고장 없음", 0.0), ("작동 이상 없음", 0.0),
        ("생활 기스 있음", 0.05), ("액정 파손", 0.2),
        ("화면 금 갔음", 0.15), ("배터리 효율 낮음", 0.1)
    ]
    extra_phrases = [
        ("박스 및 구성품 있음", 0.0), ("박스 없음", 0.02),
        ("충전기 없음", 0.03), ("추가 액세서리 포함", -0.02),
        ("정품 인증서 포함", -0.01), (None, 0.0)
    ]

    def generate_description(u, c, d, e):
        if "않음" in u or "함" in u:
            s1 = u + "."
        else:
            s1 = u + "했습니다."
        if c and d:
            if d in ["고장 없음", "작동 이상 없음"]:
                s2 = f"{c}이며 {d}."
            else:
                conn = "하지만" if any(x in c for x in ["최상", "양호", "정상"]) else "그리고"
                s2 = f"{c}{conn} {d}."
        else:
            s2 = (c or "") + (d or "")
            if s2:
                s2 += "."
        s3 = (e + ".") if e else ""
        return " ".join(s.strip() for s in (s1, s2, s3) if s)

    def calc_depr(u_val, c_adj, d_adj, e_adj):
        base = min(0.8, u_val * 0.1) if u_val > 0 else 0.1
        tot  = base + c_adj + d_adj + e_adj
        tot  = max(0.1, min(0.9, tot))
        return round(tot, 2)

    records = []
    for _, row in df.iterrows():
        u_txt, u_val = random.choice(usage_phrases)
        c_txt, c_adj = random.choice(condition_phrases)
        d_txt, d_adj = random.choice(damage_phrases)
        e_txt, e_adj = random.choice(extra_phrases)

        desc       = generate_description(u_txt, c_txt, d_txt, e_txt)
        depr       = calc_depr(u_val, c_adj, d_adj, e_adj)
        used_price = int(row['가격'] * (1 - depr))

        records.append({
            "모델명": row['모델명'],
            "카테고리": row['카테고리'],
            "상품설명": desc,
            "가격": row['가격'],
            "중고가격": used_price,
            "감가율": depr
        })

    out_df = pd.DataFrame(records)
    out_df.to_csv(output_csv, index=False)
    print(f"데이터 준비 완료 ({len(out_df)}건) → {output_csv}")

class DepreciationDataset(Dataset):
    def __init__(self, texts, labels, tokenizer, max_len=128):
        self.texts     = texts
        self.labels    = labels
        self.tokenizer = tokenizer
        self.max_len   = max_len

    def __len__(self):
        return len(self.texts)

    def __getitem__(self, idx):
        text  = self.texts[idx]
        label = float(self.labels[idx])
        enc   = self.tokenizer(
            text,
            padding='max_length',
            truncation=True,
            max_length=self.max_len,
            return_tensors='pt'
        )
        return {
            'input_ids':      enc['input_ids'].squeeze(0),
            'attention_mask': enc['attention_mask'].squeeze(0),
            'labels':         torch.tensor(label)
        }

def train_and_save(data_csv="depreciation_data.csv", save_dir="depr_model"):
    df = pd.read_csv(data_csv)
    df['text'] = df['모델명'] + " [" + df['카테고리'] + "] " + df['상품설명']

    train_df, eval_df = train_test_split(df, test_size=0.2, random_state=42)

    model_name = "bert-base-multilingual-cased"
    tokenizer  = AutoTokenizer.from_pretrained(model_name)
    model      = AutoModelForSequenceClassification.from_pretrained(
        model_name, num_labels=1, problem_type="regression"
    )

    train_ds = DepreciationDataset(
        train_df['text'].tolist(),
        train_df['감가율'].tolist(),
        tokenizer
    )
    eval_ds  = DepreciationDataset(
        eval_df['text'].tolist(),
        eval_df['감가율'].tolist(),
        tokenizer
    )

    def compute_metrics(p):
        preds  = p.predictions.flatten()
        labels = p.label_ids
        rmse   = mean_squared_error(labels, preds)**0.5
        return {'rmse': rmse}

    args = TrainingArguments(
        output_dir=save_dir,
        num_train_epochs=3,
        per_device_train_batch_size=16,
        learning_rate=2e-5,
        seed=42,
        logging_dir="./logs",
        logging_steps=50
    )

    trainer = Trainer(
        model=model,
        args=args,
        train_dataset=train_ds,
        eval_dataset=eval_ds,
        compute_metrics=compute_metrics
    )

    trainer.train()

    model.save_pretrained(save_dir)
    tokenizer.save_pretrained(save_dir)
    print(f"학습된 모델과 토크나이저가 '{save_dir}'에 저장되었습니다.")

    metrics = trainer.evaluate(eval_dataset=eval_ds)
    print(f"검증 세트 RMSE: {metrics['eval_rmse']:.4f}")

if __name__ == "__main__":
    prepare_dataset()
    train_and_save()
