import type { Pool } from "pg";
import type { UpdateDish } from "./dishes.types.js";

export function createDishesRepository(pool: Pool) {
  return {
    async getAll() {
      const result = await pool.query("SELECT * FROM dishes");
      return result.rows;
    },

    async getById(id: number) {
      const result = await pool.query("SELECT * FROM dishes WHERE id = $1", [
        id,
      ]);
      return result.rows[0];
    },

    async updateById(updateDish: UpdateDish, id: number) {
      const allowedFields: string[] = [
        "name",
        "description",
        "quantity",
        "price",
        "weight",
      ];

      const entries = Object.entries(updateDish);
      const filtered = entries.filter(([key, value]) => {
        return allowedFields.includes(key) && value !== undefined;
      });

      if (filtered.length === 0) {
        throw new Error("Нет полей для обновления");
      }
      const fields = filtered.map((field) => {
        return field[0];
      });
      const values = filtered.map((field) => {
        return field[1];
      });
      const sqlParts = fields.map((field, index) => {
        return `${field} = $${index + 1}`;
      });

      const sqlJoin = sqlParts.join(", ");

      const sql = `UPDATE dishes SET ${sqlJoin} WHERE id = $${fields.length + 1} RETURNING *`;
      const params = [...values, id];

      const result = await pool.query(sql, params);
      return result.rows[0];
    },

    async deleteById(id: number) {
      const result = await pool.query(
        "DELETE FROM dishes WHERE id = $1 RETURNING *",
        [id],
      );

      return result.rows[0];
    },

    async createDish(clientRequest: UpdateDish) {
      const result = await pool.query(
        "INSERT INTO dishes (name, description, quantity, price, weight) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [
          clientRequest.name,
          clientRequest.description,
          clientRequest.quantity,
          clientRequest.price,
          clientRequest.weight,
        ],
      );
      return result.rows[0];
    },
  };
}
