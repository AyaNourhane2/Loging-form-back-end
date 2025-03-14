import { createReservation, getReservationByNumberAndName } from '../models/Reservation.js';

export const createReservationService = async (reservation) => {
  try {
    const reservationId = await createReservation(reservation);
    return { success: true, reservationId };
  } catch (error) {
    return { success: false, message: 'Erreur lors de la création de la réservation', error };
  }
};

export const authenticateReservationService = async (reservationNumber, guestName) => {
  try {
    const reservation = await getReservationByNumberAndName(reservationNumber, guestName);
    if (reservation) {
      return { success: true, reservation };
    } else {
      return { success: false, message: 'Réservation non trouvée ou informations incorrectes' };
    }
  } catch (error) {
    return { success: false, message: 'Erreur lors de l\'authentification de la réservation', error };
  }
};