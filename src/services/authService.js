import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { findUserByEmail, createUser } from '../models/userModel.js';

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export async function registerUser({ username, email, mobile, password, role }) {
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new Error("Email déjà utilisé");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const userId = await createUser({ username, email, password: hashedPassword, mobile, role });
  return { userId };
}

export async function loginUser({ email, password, role }) {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error("Email ou mot de passe invalide");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Email ou mot de passe invalide");
  }

  if (user.userType !== role) {
    throw new Error("Rôle incorrect");
  }

  const token = jwt.sign({ id: user.id, role: user.userType }, JWT_SECRET, { expiresIn: '2h' });

  return { token };
}
