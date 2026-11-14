import "dotenv/config";

import { createApp } from "./app.js";

const app = createApp();

const port: number = Number(process.env.PORT) || 3000;

app.listen(port, () => {
  console.log(`EXPRESS ZAPUSSHEN: http://localhost:${port}`);
});
