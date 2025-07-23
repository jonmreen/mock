console.log("STARTED server.js from: ", __filename);

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

let items = [
  { id: 1, title: "First item" },
  { id: 2, title: "Second item" },
];
let currentId = 3;

const validUser = Object.freeze({
  username: 'admin',
  password: 'pass123'
});

const validTokens = new Set();

function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or invalid token' });
  }
  const token = authHeader.split(' ')[1];
  if (!validTokens.has(token)) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
}

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  console.log('Login Attempt:', { username, password });

  if (
    typeof username !== 'string' ||
    typeof password !== 'string' ||
    username.trim() === '' ||
    password.trim() === ''
  ) {
    console.log('Missing or invalid types');
    return res.status(400).json({ message: 'Username and password are required' });
  }

  if (
    username === validUser.username &&
    password === validUser.password
  ) {
    const token = 'dummy-token-' + Date.now();
    validTokens.add(token);
    console.log('Login success');
    return res.status(200).json({ token });
  }

  console.log('Invalid credentials');
  return res.status(401).json({ message: 'Invalid credentials' });
});

app.post('/logout', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];
  validTokens.delete(token);
  return res.status(200).json({ message: 'Logged out' });
});

app.get('/items', authenticate, (req, res) => {
  res.json(items);
});

app.post('/items', authenticate, (req, res) => {
  const { title } = req.body;

  if (typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ message: 'Item title is required' });
  }

  const newItem = { id: currentId++, title: title.trim() };
  items.push(newItem);
  res.status(201).json(newItem);
});

app.put('/items/:id', authenticate, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const item = items.find(i => i.id === parseInt(id));
  if (!item) return res.status(404).json({ message: 'Item not found' });
  item.title = title;
  res.json(item);
});

app.delete('/items/:id', authenticate, (req, res) => {
  const { id } = req.params;
  items = items.filter(i => i.id !== parseInt(id));
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Secure server running at http://localhost:${PORT}`);
});
