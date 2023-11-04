import "dotenv/config";

import express from "express";
import { runMigrations } from "./db";
import { createUser, getUsers, logUserIn } from "./db/repository/user";

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

runMigrations();

app.get("/user/all", getUsers);

app.post("/user", createUser);

app.post("/user/login", logUserIn);

app.get("/", async (_req, res) => res.send("Root Handler"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
