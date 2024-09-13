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
  }
};

const outputFile = path.resolve(__dirname, "swagger-output.json");
const endpointsFiles = ['src/app.ts'];

swaggerAutogen()(outputFile, endpointsFiles, doc);