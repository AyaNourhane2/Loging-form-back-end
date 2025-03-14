// app.js
import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import reservationRoutes from './routes/reservationRoutes.js';
import usersManagRoutes from './routes/usersmanagroute.js'; // Import de la nouvelle route

import { checkConnection } from './config/db.js';
import createAllTable from './utils/dbUtils.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes existantes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/feedbacks', feedbackRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/usersmanag', usersManagRoutes); // Utilisation de la nouvelle route

// Démarrer le serveur
app.listen(3000, async () => {
  console.log('Server running on port 3000');
  try {
    await checkConnection();
    await createAllTable();
  } catch (error) {
    console.log("Failed to initialize the database", error);
  }
});
