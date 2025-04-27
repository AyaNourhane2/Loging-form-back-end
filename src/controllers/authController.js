import { registerUser, loginUser } from '../services/authService.js';

export async function register(req, res) {
  try {
    console.log('Reçu:', req.body);  // Ajoute ce log

    const { username, email, mobile, password, role } = req.body;
    const result = await registerUser({ username, email, mobile, password, role });

    res.json({ success: true, message: "Inscription réussie", userId: result.userId });
  } catch (error) {
    console.error('Erreur register:', error.message); // log important
    res.status(400).json({ success: false, message: error.message });
  }
}

export async function login(req, res) {
  try {
    console.log('Tentative de login:', req.body); // Ajoute ce log

    const { email, password, role } = req.body;
    const result = await loginUser({ email, password, role });

    res.json({ success: true, message: "Connexion réussie", token: result.token });
  } catch (error) {
    console.error('Erreur login:', error.message); // log important
    res.status(400).json({ success: false, message: error.message });
  }
}
