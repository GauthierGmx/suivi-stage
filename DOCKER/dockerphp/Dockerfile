FROM php:7.4-apache

RUN apt-get update -y && apt-get upgrade -y;
RUN apt-get update && apt-get install -y \
        libxml2-dev \
	curl \
	libzip-dev \
	libcurl4-openssl-dev \
    libfreetype6-dev \
    libjpeg62-turbo-dev \
    libpng-dev \
    ssmtp \
	locales \
	libonig-dev \
    git\
    unzip\
    && docker-php-ext-configure gd --with-freetype --with-jpeg && a2enmod rewrite
RUN pecl install xdebug-3.1.5 && docker-php-ext-enable xdebug
#RUN docker-php-ext-install -j$(nproc) xmlrpc 
RUN docker-php-ext-install pdo_mysql && docker-php-ext-enable pdo_mysql 
RUN docker-php-ext-install pdo && docker-php-ext-enable pdo 
RUN docker-php-ext-install bcmath && docker-php-ext-enable bcmath
RUN docker-php-ext-install tokenizer && docker-php-ext-enable tokenizer
RUN docker-php-ext-install mbstring && docker-php-ext-enable mbstring
RUN docker-php-ext-install mysqli && docker-php-ext-enable mysqli 
RUN docker-php-ext-install curl && docker-php-ext-enable curl
RUN docker-php-ext-install json && docker-php-ext-enable json
RUN docker-php-ext-install dom && docker-php-ext-enable dom
RUN docker-php-ext-install fileinfo && docker-php-ext-enable fileinfo 
RUN docker-php-ext-install zip && docker-php-ext-enable zip 
RUN docker-php-ext-install gd && docker-php-ext-enable gd 
RUN docker-php-ext-install xml && docker-php-ext-enable xml
COPY ./docker-smtp.ini /usr/local/etc/php/conf.d/docker-smtp.ini
COPY ./ssmtp.conf /etc/ssmtp/ssmtp.conf
COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer