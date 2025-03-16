import express from 'express';
import { createReservation, getReservationByNumberAndName } from '../models/Reservation.js';

const router = express.Router();

router.post('/create', async (req, res) => {
  try {
    const reservationId = await createReservation(req.body);
    res.status(201).json({ message: 'Réservation créée avec succès', reservationId });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de la réservation', error });
  }
});

router.post('/authenticate', async (req, res) => {
  const { reservationNumber, guestName } = req.body;
  try {
    const reservation = await getReservationByNumberAndName(reservationNumber, guestName);
    if (reservation) {
      res.status(200).json({ reservation });
    } else {
      res.status(404).json({ message: 'Réservation non trouvée ou informations incorrectes' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'authentification de la réservation', error });
  }
});

export default router;