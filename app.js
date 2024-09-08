const express = require("express");
const app = express();

app.use(express.json());

const { Sequelize, DataTypes } = require("sequelize");
const sql = new Sequelize({
  dialect: "sqlite",
  storage: "./mydb.sqlite",
});

const Items = sql.define(
  "ToDoItems",
  {
    title: DataTypes.STRING,
    start: DataTypes.DATE,
    end: DataTypes.DATE,
  },
  {
    timestamps: false,
  }
);

sql.sync().then(() => {
  console.log("Sync is done...");
});

app.get("/", async (req, res) => {
  const result = await Items.findAll();
  res.send(result);
});

app.get("/:id", async (req, res) => {
  const { id } = req.params;
  const todo = await Items.findByPk(id);
  res.send(todo);
});

app.post("/", async (req, res) => {
  const { title, start, end } = req.body;
  const todo = await Items.create({ title, start, end });
  res.send(todo);
});

app.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, start, end } = req.body;
  const todo = await Items.findByPk(id);
  if (title) todo.title = title;
  if (start) todo.start = start;
  if (end) todo.end = end;
  await todo.save();
  res.send(todo);
});

app.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const todo = await Items.findByPk(id);
  const temp = todo;
  if (todo) {
    await todo.destroy({
      where: { id },
    });
  }
  res.send(temp);
});

app.listen(3000, () => {
  console.log("Server is running on port: 3000...");
});
