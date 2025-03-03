// controllers/feedbackController.js
import FeedbackModel from '../models/feedbackModel.js';
import { pool } from '../config/db.js';

// Ajouter un feedback
export const addFeedback = async (req, res) => {
  const { user_id, comment, rating } = req.body;

  if (!user_id || !comment || !rating) {
    return res.status(400).json({ success: false, message: 'Tous les champs sont obligatoires' });
  }

  try {
    const feedback = new FeedbackModel({ user_id, comment, rating });
    const query = 'INSERT INTO feedbacks (user_id, comment, rating) VALUES (?, ?, ?)';
    const values = [feedback.user_id, feedback.comment, feedback.rating];
    await pool.query(query, values);

    return res.status(201).json({ success: true, message: 'Feedback ajouté avec succès' });
  } catch (error) {
    console.error('Erreur lors de l\'ajout du feedback:', error);
    return res.status(500).json({ success: false, message: 'Échec de l\'ajout du feedback' });
  }
};

// Récupérer tous les feedbacks
export const getAllFeedbacks = async (req, res) => {
  try {
    const [feedbacks] = await pool.query('SELECT * FROM feedbacks');
    return res.status(200).json({ success: true, feedbacks });
  } catch (error) {
    console.error('Erreur lors de la récupération des feedbacks:', error);
    return res.status(500).json({ success: false, message: 'Échec de la récupération des feedbacks' });
  }
};

// Mettre à jour un feedback
export const updateFeedback = async (req, res) => {
  const { id } = req.params;
  const { comment, rating } = req.body;

  if (!comment || !rating) {
    return res.status(400).json({ success: false, message: 'Commentaire et note sont obligatoires' });
  }

  try {
    const query = 'UPDATE feedbacks SET comment = ?, rating = ? WHERE id = ?';
    const values = [comment, rating, id];
    await pool.query(query, values);

    return res.status(200).json({ success: true, message: 'Feedback mis à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du feedback:', error);
    return res.status(500).json({ success: false, message: 'Échec de la mise à jour du feedback' });
  }
};

// Supprimer un feedback
export const deleteFeedback = async (req, res) => {
  const { id } = req.params;

  try {
    const query = 'DELETE FROM feedbacks WHERE id = ?';
    await pool.query(query, [id]);

    return res.status(200).json({ success: true, message: 'Feedback supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du feedback:', error);
    return res.status(500).json({ success: false, message: 'Échec de la suppression du feedback' });
  }
};