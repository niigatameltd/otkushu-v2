import { Router } from "express";
import type { createDishesController } from "./dishes.controller.js";

type controller = ReturnType<typeof createDishesController>;

export function dishesRouter(controller: controller): Router {
  const router = Router();

  router.get("/", controller.getAllDishes);
  router.get("/:id", controller.getDishesById);
  router.patch("/:id", controller.updateDish);
  router.delete("/:id", controller.deleteDish);
  router.post("/", controller.createDish);
  return router;
}
