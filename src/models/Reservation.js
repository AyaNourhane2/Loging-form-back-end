import { pool } from '../config/db.js';

// Fonction pour créer une réservation
export const createReservation = async (reservation) => {
  const query = `
    INSERT INTO reservations (reservation_number, guest_name, check_in_date, check_out_date, room_type, email, phone_number, number_of_guests, special_requests)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    reservation.reservationNumber,
    reservation.guestName,
    reservation.checkInDate,
    reservation.checkOutDate,
    reservation.roomType,
    reservation.email,
    reservation.phoneNumber,
    reservation.numberOfGuests,
    reservation.specialRequests,
  ];

  try {
    const [result] = await pool.query(query, values);
    return result.insertId; // Retourne l'ID de la réservation créée
  } catch (error) {
    throw error;
  }
};

// Fonction pour récupérer une réservation par numéro et nom
export const getReservationByNumberAndName = async (reservationNumber, guestName) => {
  const query = `
    SELECT * FROM reservations 
    WHERE reservation_number = ? AND guest_name = ?
  `;
  const values = [reservationNumber, guestName];

  try {
    const [rows] = await pool.query(query, values);
    return rows[0]; // Retourne la première réservation trouvée
  } catch (error) {
    throw error;
  }
};