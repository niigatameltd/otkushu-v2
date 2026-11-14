import type { createDishesRepository } from "./dishes.repository.js";
import type { CreateDish, UpdateDish } from "./dishes.types.js";

type repository = ReturnType<typeof createDishesRepository>;

export function createDishesService(repository: repository) {
  return {
    async getAllDishes() {
      const result = await repository.getAll();
      return result;
    },

    async getById(id: number) {
      if (!Number.isInteger(id) || id <= 0) {
        const error = new Error("Некорректный ID блюда", { cause: 400 });
        // console.error(error);
        throw error;
      }

      const result = await repository.getById(id);

      if (!result) {
        throw new Error(`Блюдо с id ${id} не найдено`, { cause: 404 });
      }
      return result;
    },

    async updateDish(clientRequest: UpdateDish, id: number) {
      if (!Number.isInteger(id) || id <= 0) {
        const error = new Error("Некорректный ID блюда", { cause: 400 });
        // console.error(error);
        throw error;
      }

      const hasFields = Object.values(clientRequest).some((value) => {
        return value !== undefined;
      });

      if (!hasFields) {
        throw new Error("Передайте хотябы одно поле для обновления", {
          cause: 400,
        });
      }

      const result = await repository.updateById(clientRequest, id);

      if (!result) {
        throw new Error(`Блюдо с id ${id} не найдено`, { cause: 404 });
      }

      return result;
    },

    async deleteDish(id: number) {
      if (!Number.isInteger(id) || id <= 0) {
        const error = new Error("Некорректный ID блюда", { cause: 400 });
        // console.error(error);
        throw error;
      }
      const result = await repository.deleteById(id);
      if (!result) {
        throw new Error(`Блюдо с id ${id} не найдено`, { cause: 404 });
      }
      return result;
    },
    async createDish(clientRequest: CreateDish) {
      const requiredFields: (keyof CreateDish)[] = [
        "name",
        "description",
        "price",
        "quantity",
        "weight",
      ];

      // есть ли значение у каждого обязательного поля?
      const check = requiredFields.every((field) => {
        return clientRequest[field] !== undefined;
      });

      if (!check) {
        throw new Error("Не переданы все обязательные поля", { cause: 400 });
      }

      const validValues = requiredFields.every((field) => {
        return clientRequest[field] !== null && clientRequest[field] !== "";
      });

      if (!validValues) {
        throw new Error("Некорректное значение", { cause: 400 });
      }

      const result = await repository.createDish(clientRequest);
      if (!result) {
        throw new Error(`Результата от базы данных нет`, { cause: 404 });
      }
      return result;
    },
  };
}
