
### 실행 방법
```
npm run dev
```

```
npm i typescript // 타입스크립트 설치
npm init -y   // package.json 파일 생성
npm i -D express ts-node nodemon @types/node @types/express // express, ts-node, nodemon, @types/node, @types/express 설치
npx tsc --init // tsconfig.json 파일 생성

npm i swagger-ui-express swagger-jsdoc // swagger 설치
npm i swagger-autogen // swagger-autogen 설치 https://swagger-autogen.github.io/docs/
```


```
npm i --save-dev @types/cookie-parser 
npm i --save-dev @types/morgan
npm i --save-dev @types/debug
npm i --save-dev @types/swagger-jsdoc
npm i --save-dev @types/swagger-ui-express 
```

```
npm run build && docker build -t node-api:local . && docker run -p 3000:3000 node-api:local
```