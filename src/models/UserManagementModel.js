import { pool } from '../config/db.js';

class UserManagementModel {
  static async getAllUsers() {
    const [rows] = await pool.query('SELECT * FROM `user-management`');
    return rows;
  }

  static async addUser(name, userType) {
    const [result] = await pool.query(
      'INSERT INTO `user-management` (name, userType) VALUES (?, ?)',
      [name, userType]
    );
    return { id: result.insertId, name, userType }; // Retourne l'utilisateur ajouté
  }

  static async updateUser(id, name, userType) {
    const [result] = await pool.query(
      'UPDATE `user-management` SET name = ?, userType = ? WHERE id = ?',
      [name, userType, id]
    );
    return { id, name, userType }; // Retourne l'utilisateur mis à jour
  }

  static async deleteUser(id) {
    const [result] = await pool.query('DELETE FROM `user-management` WHERE id = ?', [id]);
    return result;
  }
}

export default UserManagementModel;