# 빌드 단계
FROM node:lts AS builder

# 작업 디렉토리 설정
WORKDIR /usr/src/app

# 의존성 파일 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

COPY --chown=appuser builder/node-v22.14.0-linux-x64.tar.xz ./node.tar.xz
RUN tar -xvf node.tar.xz

# 애플리케이션 소스 코드 복사
COPY *.json ./
COPY src src


# 애플리케이션 빌드 (필요한 경우)
RUN npm run build

## 실행 단계 #  sqlite3 라이브러리 로딩 문제로 alpine 대신 unbuntu 사용
#FROM node:lts-alpine
#
##RUN sed 's/https/http/g' -i /etc/apk/repositories
##RUN apk update && apk --no-cache add build-base python3 libc6-compat
#
## 앱 사용자 생성
## alpine
#RUN addgroup -S appgroup && adduser -S appuser -G appgroup
#USER appuser
#
#WORKDIR /home/appuser
## 작업 디렉토리 설정
#
#ENV REDIS_HOST=172.27.6.8
#ENV REDIS_PORT=7379
#
## 의존성 파일 복사
#COPY --chown=appuser package*.json ./
#
## 의존성 복사
#COPY --from=builder --chown=appuser /usr/src/app/node_modules ./node_modules
#
## 빌드 단계에서 생성된 결과물만 복사
#COPY --from=builder --chown=appuser /usr/src/app/dist ./dist
#
## 실행에 필요한 포트 노출
#EXPOSE 3000
#
## 애플리케이션 실행
#ENTRYPOINT ["npm", "run", "start"]
#
# 1. 우분투 이미지를 기반으로 사용
FROM ubuntu:noble

## alpine
#RUN addgroup -S appgroup && adduser -S appuser -G appgroup
## ubuntu
RUN groupadd appgroup && useradd appuser -m -G appgroup
USER appuser

WORKDIR /home/appuser

ENV REDIS_HOST=172.27.6.8
ENV REDIS_PORT=7379

# 의존성 파일 복사
COPY --chown=appuser package*.json ./

# 의존성 복사
COPY --from=builder --chown=appuser /usr/src/app/node_modules ./node_modules

# 빌드 단계에서 생성된 결과물만 복사
COPY --from=builder --chown=appuser /usr/src/app/dist ./dist

# nodejs 설치
COPY --from=builder --chown=appuser /usr/src/app/node-v22.14.0-linux-x64 ./node-linux-x64

ENV PATH="/home/appuser/node-linux-x64/bin:${PATH}"

# 실행에 필요한 포트 노출
EXPOSE 3000

# 애플리케이션 실행
ENTRYPOINT ["npm", "run", "start"]