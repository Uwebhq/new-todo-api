require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors('*'));
app.use(express.json());

let todos = [
    { id : 1, task : 'Finish week 4 slides', completed: false},
    { id : 2, task : 'Deploy API (today!)', completed: true}
];
let nextId = 1;
app.get('/', (req, res) => res.send('Your Todo API is ready!!'));

// Order matters: specific routes BEFORE parameterized ones
app.get('/todos/completed', (req, res) => {
  res.json(todos.filter(t => t.completed));
});

app.get('/todos', (req, res) => res.status(200).json(todos));

app.get('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const todo = todos.find(t => t.id === id);
  if (!todo) return res.status(404).json({ error: 'Not found' });
  res.status(200).json(todo);
});

app.post('/todos', (req, res) => {
  const { task } = req.body;
  if (!task) return res.status(400).json({ error: 'Task required' });
  const newTodo = { id: nextId++, task, completed: false };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

app.patch('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const todo = todos.find(t => t.id === id);
  if (!todo) return res.status(404).json({ message: 'Todo not found' });
  if (req.body.task !== undefined) todo.task = req.body.task;
  if (req.body.completed !== undefined) todo.completed = req.body.completed;
  res.status(200).json(todo);
});

app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const idx = todos.findIndex(t => t.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  todos.splice(idx, 1);
  res.status(204).send();
});

// Error handler last
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Server error!' });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`API alive on ${PORT}`));