import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import { checkDatabaseConnection } from './utils/dbUtils.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// IMPORTANT !
app.use(cors());
app.use(express.json()); // POUR lire req.body !

checkDatabaseConnection()
  .then(() => console.log('✅ Database connected'))
  .catch(err => console.error('❌ Database connection failed:', err));

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.json({ message: "API MySQL Ready" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
