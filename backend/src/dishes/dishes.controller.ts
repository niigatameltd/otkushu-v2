import type { Request, Response } from "express";
import type { createDishesService } from "./dishes.service.js";
import type { CreateDish, UpdateDish } from "./dishes.types.js";
type service = ReturnType<typeof createDishesService>;

export function createDishesController(service: service) {
  return {
    async getAllDishes(req: Request, res: Response) {
      const result = await service.getAllDishes();
      res.status(200).json({ success: "ok", body: result });
    },

    async getDishesById(req: Request, res: Response) {
      const id = Number(req.params.id);

      const result = await service.getById(id);

      res.status(200).json({ success: "ok", body: result });
    },

    async updateDish(req: Request, res: Response) {
      const id = Number(req.params.id);
      const clientRequest: UpdateDish = {
        name: req.body.name,
        description: req.body.description,
        quantity: req.body.quantity,
        price: req.body.price,
        weight: req.body.weight,
      };

      const result = await service.updateDish(clientRequest, id);
      res
        .status(200)
        .json({ success: "ok", message: "Успешное обновление", body: result });
    },

    async deleteDish(req: Request, res: Response) {
      const id = Number(req.params.id);
      const result = await service.deleteDish(id);
      res
        .status(200)
        .json({ success: "ok", message: "Успешное удаление", body: result });
    },

    async createDish(req: Request, res: Response) {
      const clientRequest: CreateDish = {
        name: req.body.name,
        description: req.body.description,
        quantity: req.body.quantity,
        price: req.body.price,
        weight: req.body.weight,
      };

      const result = await service.createDish(clientRequest);
      res.status(201).json({
        success: "ok",
        message: "Блюдо успешно создано",
        body: result,
      });
    },
  };
}
