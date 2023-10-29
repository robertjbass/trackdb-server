import "dotenv/config";
import express from "express";
import { runMigrations } from "./db";
import { createUser, getUsers } from "./db/repository/user";

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

runMigrations();

app.get("/", async (_req, res) => {
  res.send("Hello World");
});

app.get("/user/all", async (_req, res) => {
  const users = await getUsers();
  res.json(users);
});

app.post("/users", async (req, res) => {
  await createUser(req.body);
  res.send("Success");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
