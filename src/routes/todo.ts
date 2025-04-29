import { Router } from 'express';
import db from '../db';
import { authenticate } from '../server';

const router = Router();


export default router;

// Todo routes
router.get('/', authenticate, async (req, res) => {
  const [todos] = await db.query('SELECT * FROM todos WHERE user_id = ?', [req.user.id]);
  res.json(todos);
});

router.post('/', authenticate, async (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ message: 'Title required' });

  await db.query('INSERT INTO todos (user_id, title) VALUES (?, ?)', [req.user.id, title]);
  res.status(201).json({ message: 'Todo created' });
});

router.put('/:id', authenticate, async (req, res) => {
  const { title } = req.body;
  const { id } = req.params;

  await db.query('UPDATE todos SET title = ? WHERE id = ? AND user_id = ?', [title, id, req.user.id]);
  res.json({ message: 'Todo updated' });
});

router.delete('/:id', authenticate, async (req, res) => {
  const { id } = req.params;

  await db.query('DELETE FROM todos WHERE id = ? AND user_id = ?', [id, req.user.id]);
  res.json({ message: 'Todo deleted' });
});



