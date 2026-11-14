import type { PoolConfig } from "pg";

export function makeDbConfig(): PoolConfig {
  if (!process.env.DB_PASSWORD) {
    throw new Error("Ошибка: переменная DB_PASSWORD не найдена в .env");
  }
  return {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
  };
}
