import express from "express";
import type { Request, Response, Express, NextFunction } from "express";
import { dishesRouter } from "./dishes/dishes.router.js";
import { Pool } from "pg";

import { makeDbConfig } from "./config/db.js";
import { createDishesRepository } from "./dishes/dishes.repository.js";
import { createDishesService } from "./dishes/dishes.service.js";
import { createDishesController } from "./dishes/dishes.controller.js";

export function createApp(): Express {
  console.log("Проверка ENV:", {
    user: process.env.DB_USER,
    db: process.env.DB_NAME,
    passLength: process.env.DB_PASSWORD?.length, // покажет длину пароля или undefined
  });
  const app: Express = express(); // экспресс

  app.use(express.json()); // парсер

  const pool = new Pool(makeDbConfig());

  app.get("/", (req, res) => {
    res.status(200).json({ message: "Hello" });
  });

  // сборка блюд:
  const dishesRepository = createDishesRepository(pool);
  const dishesService = createDishesService(dishesRepository);
  const dishesController = createDishesController(dishesService);
  app.use("/api/dishes", dishesRouter(dishesController));

  // Обязательно 4 аргумента (err, req, res, next), иначе Express не поймет, что это обработчик ошибок
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    const status = typeof err.cause === "number" ? err.cause : 500;
    res.status(status).json({
      success: false,
      message: err.message || "Внутренняя ошибка сервера",
    });
  });

  return app;
}
