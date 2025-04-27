// controllers/accountingController.js
import { AccountingService } from '../services/accountingService.js';

export const AccountingController = {
  getEntries: async (req, res) => {
    try {
      const { type } = req.params;
      const { search } = req.query;
      
      const entries = await AccountingService.getEntries(type, search);
      res.json(entries);
    } catch (error) {
      res.status(500).json({ 
        error: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : null
      });
    }
  },

  getEntryDetails: async (req, res) => {
    try {
      const { id } = req.params;
      const entry = await AccountingService.getEntryDetails(id);
      
      if (!entry) {
        return res.status(404).json({ error: 'Entrée non trouvée' });
      }
      
      res.json(entry);
    } catch (error) {
      res.status(500).json({ 
        error: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : null
      });
    }
  },

  createEntry: async (req, res) => {
    try {
      const entryData = {
        ...req.body,
        created_by: req.user.id
      };
      
      const entryId = await AccountingService.createEntry(entryData);
      res.status(201).json({ 
        id: entryId, 
        message: 'Entrée créée avec succès' 
      });
    } catch (error) {
      res.status(400).json({ 
        error: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : null
      });
    }
  },

  updateStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      await AccountingService.updateStatus(id, status);
      res.json({ message: 'Statut mis à jour avec succès' });
    } catch (error) {
      res.status(400).json({ 
        error: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : null
      });
    }
  },

  deleteEntry: async (req, res) => {
    try {
      const { id } = req.params;
      
      await AccountingService.deleteEntry(id);
      res.json({ message: 'Entrée supprimée avec succès' });
    } catch (error) {
      res.status(400).json({ 
        error: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : null
      });
    }
  }
};