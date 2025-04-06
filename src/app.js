import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { pool } from './config/db.js';
import createAllTables from './utils/dbUtils.js';

// Import des routes
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import reservationRoutes from './routes/reservationRoutes.js';
import usersManagRoutes from './routes/usersmanagroute.js';


const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/feedbacks', feedbackRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/usersmanag', usersManagRoutes);


// Route de test
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'API en fonctionnement',
    timestamp: new Date().toISOString()
  });
});

// Initialisation asynchrone
const startServer = async () => {
  try {
    // Vérification connexion DB
    const conn = await pool.getConnection();
    console.log('✅ Connecté à la base de données MySQL');
    conn.release();

    // Création des tables
    await createAllTables();
    console.log('✅ Tables vérifiées/créées');

    // Démarrage du serveur
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('❌ Erreur initialisation:', error);
    process.exit(1);
  }
};

// Gestion des erreurs non catchées
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// Démarrer l'application
startServer();