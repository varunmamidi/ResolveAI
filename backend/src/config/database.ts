
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

export const sequelize = new Sequelize({
  database: process.env.DB_NAME!,
  username: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  host: process.env.DB_HOST!,
  port: Number(process.env.DB_PORT || 5433),
  dialect: "postgres",
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

export const connectDB = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log("PostgreSQL connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error);
    throw error;
  }
};
