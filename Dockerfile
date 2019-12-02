FROM python:latest

RUN apt-get update -qq && \
    apt-get install -y build-essential \
    postgresql \
    postgresql-contrib \
    libpq-dev \
    nodejs \ 
    locales

RUN echo "ja_JP UTF-8" > /etc/locale.gen
RUN locale-gen

RUN mkdir /system
WORKDIR /system

ADD requirements.base.txt /system/requirements.base.txt
ADD requirements.txt /system/requirements.txt

RUN pip install --upgrade pip

RUN pip install --no-cache-dir -r requirements.base.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY manage.py /system/manage.py
ADD manage.py /system/manage.py

ADD run.sh /system

ADD . /system
COPY . /system
# RUN python manage.py collectstatic --noinput