// services/accountingService.js
import { AccountingModel } from '../models/accountingModel.js';

export const AccountingService = {
  getEntries: async (entryType, searchTerm = '') => {
    try {
      if (searchTerm) {
        return await AccountingModel.searchEntries(entryType, searchTerm);
      }
      return await AccountingModel.getAllEntries(entryType);
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des ${entryType}: ${error.message}`);
    }
  },

  getEntryDetails: async (id) => {
    try {
      const [entry] = await pool.query(
        `SELECT ae.*, um.username as created_by_username 
         FROM accounting_entries ae
         JOIN user_management um ON ae.created_by = um.id
         WHERE ae.id = ?`,
        [id]
      );
      return entry[0] || null;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des détails: ${error.message}`);
    }
  },

  createEntry: async (entryData) => {
    try {
      return await AccountingModel.createEntry(entryData);
    } catch (error) {
      throw new Error(`Erreur lors de la création de l'entrée: ${error.message}`);
    }
  },

  updateStatus: async (id, status) => {
    try {
      const affectedRows = await AccountingModel.updateEntryStatus(id, status);
      if (affectedRows === 0) {
        throw new Error('Entrée non trouvée');
      }
    } catch (error) {
      throw new Error(`Erreur lors de la mise à jour du statut: ${error.message}`);
    }
  },

  deleteEntry: async (id) => {
    try {
      const affectedRows = await AccountingModel.deleteEntry(id);
      if (affectedRows === 0) {
        throw new Error('Entrée non trouvée');
      }
    } catch (error) {
      throw new Error(`Erreur lors de la suppression de l'entrée: ${error.message}`);
    }
  }
};