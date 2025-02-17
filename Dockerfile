# 빌드 단계
FROM node:lts AS builder

# 작업 디렉토리 설정
WORKDIR /usr/src/app

# 의존성 파일 복사
COPY package*.json ./

# 의존성 설치
RUN npm ci --only=production

# 애플리케이션 소스 코드 복사
COPY . .

# 애플리케이션 빌드 (필요한 경우)
RUN npm run build

# 실행 단계
FROM node:lts-alpine3.21

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

WORKDIR /home/appuser
# 작업 디렉토리 설정

# 의존성 파일 복사
COPY --chown=appuser package*.json ./

# 의존성 복사
COPY --from=builder --chown=appuser /usr/src/app/node_modules ./node_modules

# 빌드 단계에서 생성된 결과물만 복사
COPY --from=builder --chown=appuser /usr/src/app/dist ./dist

# 실행에 필요한 포트 노출
EXPOSE 3000

# 애플리케이션 실행
ENTRYPOINT ["npm", "run", "start"]