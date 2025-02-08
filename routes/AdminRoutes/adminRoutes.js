import express from 'express';
import { authenticate, authorizeAdmin } from '../../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/dashboard', authenticate, authorizeAdmin, (req, res) => {
  res.json({ message: 'Welcome to the admin dashboard' });
});

export default router;
