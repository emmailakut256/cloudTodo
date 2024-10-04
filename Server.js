const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/todoapp', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Define Todo model
const Todo = mongoose.model("Todo", new mongoose.Schema({
  task: { type: String, required: true },
  completed: { type: Boolean, default: false }
}));

// API routes

// Get all todos
app.get("/api/todos", async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

// Add a new todo
app.post("/api/todos", async (req, res) => {
  const newTodo = new Todo({
    task: req.body.task,
  });
  const savedTodo = await newTodo.save();
  res.json(savedTodo);
});

// Update todo (complete or edit task)
app.put("/api/todos/:id", async (req, res) => {
  const { task, completed } = req.body;
  const updatedTodo = await Todo.findByIdAndUpdate(
    req.params.id,
    { task, completed },
    { new: true }
  );
  res.json(updatedTodo);
});

// Delete todo
app.delete("/api/todos/:id", async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ message: "Todo deleted" });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
