
import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "ResolveAI API",
      version: "1.0.0",
      description:
        "AI-Powered Enterprise Customer Support Platform"
    },
    servers: [
      {
        url: "/",
        description: "ResolveAI API Server"
    }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    }
  },
  apis: ["./src/routes/*.ts"]
};

export const swaggerSpec = swaggerJsdoc(options);
