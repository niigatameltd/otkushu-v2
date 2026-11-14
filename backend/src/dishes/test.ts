const id = 7;

const updateDish = {
  name: undefined,
  description: undefined,
  price: 250,
  quantity: 0,
  weight: undefined,
};

// UPDATE dishes
// SET name = $1, price = $2, quantity = $3
// WHERE id = $4
// RETURNING *;

// ["Борщ с мясом", 250, 15, 7]

const entries = Object.entries(updateDish);
const filtered = entries.filter(([key, value]) => {
  return value !== undefined;
}); // отсекаем не переданные поля

const fields = filtered.map((field) => {
  return field[0];
});
const values = filtered.map((field) => {
  return field[1];
});

// получаем строку name = $1...
const sqlParts = fields.map((field, index) => {
  return `${field} = $${index + 1}`;
});
const sqlJoin = sqlParts.join(", ");

const sql = `UPDATE dishes SET ${sqlJoin} WHERE id = $${fields.length + 1} RETURNING *`;
const params = [...values, id];

console.log(sql);
console.log(params);
