import { pool } from '../config/db.js';

export async function findUserByEmail(email) {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
}

export async function createUser({ username, email, password, mobile, role }) {
  const [result] = await pool.query(
    `INSERT INTO users (username, email, password, mobile, userType) VALUES (?, ?, ?, ?, ?)`,
    [username, email, password, mobile, role]
  );
  return result.insertId;
}
