FROM python:3.10

WORKDIR /app

RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
COPY .env .

EXPOSE 5000

CMD ["python", "app.py"]