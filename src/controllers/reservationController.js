import { createReservation } from '../models/Reservation.js';

export const createReservationController = async (req, res) => {
  const reservation = req.body;

  try {
    const reservationId = await createReservation(reservation);
    res.status(201).json({ message: 'Réservation créée avec succès', reservationId });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de la réservation', error });
  }
};