FROM python:3.12-alpine
WORKDIR /app


ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONBUFFERED=1

#RUN apt-get update && apt-get install -y netcat-openbsd
RUN apk add --no-cache libpq-dev gcc musl-dev

RUN pip install --upgrade pip
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

COPY ./entrypoint.sh /backend/entrypoint.sh
RUN sed -i 's/\r$//g' /backend/entrypoint.sh
RUN chmod +x /backend/entrypoint.sh

COPY . .

ENTRYPOINT ["/backend/entrypoint.sh"]