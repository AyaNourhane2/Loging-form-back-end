import express from 'express';
import { registerUser, loginUser, getUserFromToken } from '../services/authService.js';

const router = express.Router();

// User registration
router.post('/register', async (req, res) => {
  const user = req.body;
  const result = await registerUser(user);
  res.status(result.success ? 201 : 400).json(result);
});

// User login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const result = await loginUser(email, password);
  res.status(result.success ? 200 : 400).json(result);
});

// Get user details from token
router.get('/user-details', async (req, res) => {
  const token = req.headers.authorization;
  const result = await getUserFromToken(token);
  res.status(result.success ? 200 : 400).json(result);
});

export default router;
