// routes/feedbackRoutes.js
import express from 'express';
import { addFeedback, getAllFeedbacks, updateFeedback, deleteFeedback } from '../controllers/feedbackController.js';

const router = express.Router();

router.post('/add-feedback', addFeedback); // Ajouter un feedback
router.get('/get-feedbacks', getAllFeedbacks); // Récupérer tous les feedbacks
router.put('/update-feedback/:id', updateFeedback); // Mettre à jour un feedback
router.delete('/delete-feedback/:id', deleteFeedback); // Supprimer un feedback

export default router;