import "dotenv/config";

import express from "express";
import { runMigrations } from "./db";
import { expressSession } from "./middleware/auth";
import userRouter from "./router/userRouter";

declare module "express-session" {
  export interface SessionData {
    user: { [key: string]: any };
  }
}

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(expressSession);

runMigrations();

app.use("/user", userRouter);

app.get("/", async (_req, res) => res.send("Root Handler"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
