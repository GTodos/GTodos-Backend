import { Router } from 'express';
import db from '../db';
import { JWT_SECRET } from '../server';
import { RowDataPacket } from 'mysql2';


const bcrypt = require('bcryptjs');
const router = Router();
const jwt = require('jsonwebtoken');


interface User extends RowDataPacket {
  id: number;
  username: string;
  password: string;
}


router.get('/', async (req, res) => {
  try {
    const [users] = await db.query('SELECT * FROM users');
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

export default router;

// Signup
router.post('/signup', async (req, res) => {
  const { username, password, email } = req.body;
  console.log(req.body);
  if (!username || !password || !email) return res.status(400).json({ message: 'Missing fields' });

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await db.query('INSERT INTO users (username, password, email) VALUES (?, ?, ?)', [username, hashedPassword, email]);
    res.status(201).json({ message: 'User created' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Username might already exist' });
  }
});

// Signin
router.post('/signin', async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await db.query<User[]>('SELECT * FROM users WHERE username = ?', [username]);
    const user = rows[0];

    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});



