import { Router, Request } from 'express';
import db from '../db';
import { authenticate } from '../server';

const router = Router();

export default router;

// Todo routes
router.get('/', authenticate, async (req, res) => {
  const userId = (req as Request & {user: {id: string}}).user.id;
  const [todos] = await db.query('SELECT * FROM todos WHERE user_id = ?', [userId]);
  res.json(todos);
});

router.post('/', authenticate, async (req, res) => {
  const userId = (req as Request & {user: {id: string}}).user.id;
  const { content } = req.body;
  if (!content) return res.status(400).json({ message: 'Content required' });

  await db.query('INSERT INTO todos (user_id, content) VALUES (?, ?)', [userId, content]);
  res.status(201).json({ message: 'Todo created' });
});

router.put('/:id', authenticate, async (req, res) => {
  const userId = (req as Request & {user: {id: string}}).user.id;
  const { content } = req.body;
  const { id } = req.params;

  await db.query('UPDATE todos SET content = ? WHERE id = ? AND user_id = ?', [content, id, userId]);
  res.json({ message: 'Todo updated' });
});

router.delete('/:id', authenticate, async (req, res) => {
  const userId = (req as Request & {user: {id: string}}).user.id;
  const { id } = req.params;

  await db.query('DELETE FROM todos WHERE id = ? AND user_id = ?', [id, userId]);
  res.json({ message: 'Todo deleted' });
});

router.put('/:id/done', authenticate, async (req, res) => {
  const userId = (req as Request & {user: {id: string}}).user.id;
  const { id } = req.params;

  await db.query('UPDATE todos SET finished_at = CURRENT_TIME() WHERE id = ? AND user_id = ?', [id, userId]);
  res.json({ message: 'Todo updated' });
});

router.put('/:id/undone', authenticate, async (req, res) => {
  const userId = (req as Request & {user: {id: string}}).user.id;
  const { id } = req.params;

  await db.query('UPDATE todos SET finished_at = NULL WHERE id = ? AND user_id = ?', [id, userId]);
  res.json({ message: 'Todo updated' });
});






