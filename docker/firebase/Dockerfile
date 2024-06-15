FROM ubuntu:22.04

RUN apt update && \
apt install -y curl openjdk-17-jdk && \
curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
apt install -y nodejs

RUN npm install -g firebase-tools

RUN curl https://sdk.cloud.google.com > install.sh
RUN bash install.sh --disable-prompts --install-dir=/opt
RUN echo 'export PATH=$PATH:/opt/google-cloud-sdk/bin' >> ~/.bashrc 
