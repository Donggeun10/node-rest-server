import swaggerAutogen from "swagger-autogen";
import path from "path";

const doc = {
    info: {
        title: "Express API with Swagger",
        description: "This is a simple CRUD API application made with Express and documented with Swagger",
    },
    host: "localhost:3000",
    basePath: "/",
    schemes: ['http'],
    securityDefinitions: {
        basicAuth: {
            type: 'basic',
            in:   'header',
            name:   'Authorization',
            value:  'Basic <user:password>'
        }, apiKeyAuth: {
            type: "apiKey", name: "X-API-KEY", in: "header"
        }, bearerAuth: {
            type: "http", name: "Authorization", in: "header", scheme: "bearer"
        }
    },
    definitions: { // 모델 정의 (User 모델에서 사용되는 속성 정의)
        'Score': {
            type: 'object',
            properties: {
                playerName: {
                    type: 'string'
                },
                stage: {
                    type: 'integer'
                },
                score: {
                    type: 'integer'
                },
                playTime: {
                    type: 'integer'
                },
                dateTime: {
                    type: 'string'
                },
                timestamp: {
                    type: 'string'
                },
                timeZone: {
                    type: 'string'
                }
            }
        }
    },
};

const outputFile = path.resolve(__dirname, "swagger-output.json");
const endpointsFiles = ['src/app.ts'];

swaggerAutogen()(outputFile, endpointsFiles, doc);