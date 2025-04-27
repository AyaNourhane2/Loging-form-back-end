// routes/accountingRoutes.js
import express from 'express';
import { AccountingController } from '../controllers/accountingController.js';

const router = express.Router();

router.get('/:type', AccountingController.getEntries);
router.post('/', AccountingController.createEntry);
router.patch('/:id/status', AccountingController.updateStatus);
router.delete('/:id', AccountingController.deleteEntry);

export default router;