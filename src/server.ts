import express from 'express';
import dotenv from 'dotenv';
import usersRouter from './routes/users';
import todoRouter from './routes/todo';
import { Request, Response, NextFunction } from 'express';




dotenv.config();

const jwt = require('jsonwebtoken');

export const JWT_SECRET = process.env.JWT_SECRET;

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

// Middleware to authenticate token
interface AuthRequest extends Request {
  user?: any; // Ideally you define a proper user interface
}

export async function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Missing token' });

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = user;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid token' });
  }
}


// Routes
app.use('/users', usersRouter);
app.use('/todos', todoRouter);

app.get('/', (_req, res) => {
  res.send('Server is up and running!');
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
