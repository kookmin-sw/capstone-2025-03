FROM python:3.11-slim

WORKDIR /app
COPY . /app

RUN apt-get update && apt-get install -y default-jdk build-essential curl git \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# JAVA_HOME 설정
ENV JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
ENV PATH="$JAVA_HOME/bin:$PATH"

RUN pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt

# JVM 초기화가 필요한 작업을 미리 수행 (선택적)
RUN python -c "from konlpy.tag import Okt; Okt().morphs('초기화테스트')"

CMD ["uvicorn", "predict:app", "--host", "0.0.0.0", "--port", "8080"]
