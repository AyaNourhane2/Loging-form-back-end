// app.js
import express from 'express';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js'; // Importer les routes des feedbacks
import { checkConnection } from './config/db.js';
import createAllTable from './utils/dbUtils.js';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json()); // Middleware pour parser les corps JSON

// Utiliser les routes pour les utilisateurs, l'authentification et les feedbacks
app.use('/api/users', userRoutes); // Routes pour les utilisateurs
app.use('/api/auth', authRoutes); // Routes pour l'authentification
app.use('/api/feedbacks', feedbackRoutes); // Routes pour les feedbacks

// Démarrer le serveur
app.listen(3000, async () => {
  console.log('Server running on port 3000');
  try {
    await checkConnection(); // Vérifier la connexion à la base de données
    await createAllTable(); // Créer les tables si elles n'existent pas
  } catch (error) {
    console.log("Failed to initialize the database", error);
  }
});
