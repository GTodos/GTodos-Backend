import { Router, Request } from 'express';
import db from '../db';
import { authenticate } from '../server';

const router = Router();

export default router;

// Todo routes
router.get('/', authenticate, async (req, res) => {
  const userId = (req as Request & {user: {id: string}}).user.id;
  const { list_id } = req.params;
  if(list_id) {
    const [todos] = await db.query('SELECT * FROM todos WHERE user_id = ? AND list_id = ?', [userId, list_id]);
    return res.json(todos);
  } else {
    const [todos] = await db.query('SELECT * FROM todos WHERE user_id = ?', [userId]);
    res.json(todos);
  }
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



