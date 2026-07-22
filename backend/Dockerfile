# OrkestrAI backend — Railway'de Dockerfile builder ile de deploy edilebilir.
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app

# Railway $PORT ortam değişkenini enjekte eder; lokalde 8000'e düşer.
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port $PORT"]
