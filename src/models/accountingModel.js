// models/accountingModel.js
import { pool } from '../config/db.js';

export const AccountingModel = {
  getAllEntries: async (entryType) => {
    const [rows] = await pool.query(
      'SELECT * FROM accounting_entries WHERE entry_type = ? ORDER BY entry_date DESC',
      [entryType]
    );
    return rows;
  },

  createEntry: async (entryData) => {
    const { entry_type, client_name, amount, payment_method, status, created_by } = entryData;
    const [result] = await pool.query(
      `INSERT INTO accounting_entries 
      (entry_type, client_name, amount, payment_method, status, created_by) 
      VALUES (?, ?, ?, ?, ?, ?)`,
      [entry_type, client_name, amount, payment_method, status, created_by]
    );
    return result.insertId;
  },

  updateEntryStatus: async (id, status) => {
    const [result] = await pool.query(
      'UPDATE accounting_entries SET status = ? WHERE id = ?',
      [status, id]
    );
    return result.affectedRows;
  },

  deleteEntry: async (id) => {
    const [result] = await pool.query(
      'DELETE FROM accounting_entries WHERE id = ?',
      [id]
    );
    return result.affectedRows;
  },

  searchEntries: async (entryType, searchTerm) => {
    const [rows] = await pool.query(
      `SELECT * FROM accounting_entries 
      WHERE entry_type = ? 
      AND (client_name LIKE ? OR status LIKE ? OR payment_method LIKE ?) 
      ORDER BY entry_date DESC`,
      [entryType, `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`]
    );
    return rows;
  }
};