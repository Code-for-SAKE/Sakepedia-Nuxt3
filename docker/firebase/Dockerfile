FROM ubuntu:22.04

RUN apt update && \
apt install -y curl openjdk-17-jdk && \
curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
apt install -y nodejs

RUN npm install -g firebase-tools