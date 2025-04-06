import { pool } from '../config/db.js';

// Définition des requêtes de création de tables
const tableDefinitions = {
  user_management: `
    CREATE TABLE IF NOT EXISTS user_management (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) NOT NULL UNIQUE,
      email VARCHAR(100) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      first_name VARCHAR(50),
      last_name VARCHAR(50),
      user_type ENUM('super_admin','admin','manager','user','guest') NOT NULL DEFAULT 'user',
      is_active BOOLEAN NOT NULL DEFAULT TRUE,
      last_login DATETIME,
      failed_login_attempts INT DEFAULT 0,
      password_reset_token VARCHAR(255),
      password_reset_expires DATETIME,
      created_by INT,
      updated_by INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_user_type (user_type),
      INDEX idx_is_active (is_active),
      CONSTRAINT fk_created_by FOREIGN KEY (created_by) REFERENCES user_management(id),
      CONSTRAINT fk_updated_by FOREIGN KEY (updated_by) REFERENCES user_management(id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `,
  
  user_roles: `
    CREATE TABLE IF NOT EXISTS user_roles (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      role_name VARCHAR(50) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES user_management(id) ON DELETE CASCADE,
      UNIQUE KEY unique_user_role (user_id, role_name)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `,
  
  audit_logs: `
    CREATE TABLE IF NOT EXISTS audit_logs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT,
      action VARCHAR(50) NOT NULL,
      table_name VARCHAR(50) NOT NULL,
      record_id INT,
      old_values JSON,
      new_values JSON,
      ip_address VARCHAR(45),
      user_agent TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES user_management(id) ON DELETE SET NULL,
      INDEX idx_action (action),
      INDEX idx_table_name (table_name),
      INDEX idx_created_at (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `
};

/**
 * Crée une table spécifique avec gestion des erreurs
 * @param {string} tableName - Nom de la table
 * @param {string} query - Requête SQL de création
 */
const createTable = async (tableName, query) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    await connection.query(query);
    await connection.commit();
    console.log(`✅ Table ${tableName} créée avec succès`);
  } catch (error) {
    await connection.rollback();
    console.error(`❌ Erreur création table ${tableName}:`, error.message);
    throw error;
  } finally {
    connection.release();
  }
};

/**
 * Initialise les données par défaut
 */
const seedInitialData = async () => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    // Vérifier si l'admin existe déjà
    const [users] = await connection.query('SELECT COUNT(*) as count FROM user_management');
    if (users[0].count === 0) {
      // Mot de passe: "Admin123!" hashé avec bcrypt
      const adminPassword = '$2a$10$N9qo8uLOickgx2ZMRZoMy.MZHbjS2X6AJR6dRWRo7KTCCa7Pq3L8a';
      
      await connection.query(`
        INSERT INTO user_management 
        (username, email, password_hash, first_name, last_name, user_type, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, ['admin', 'admin@example.com', adminPassword, 'System', 'Administrator', 'super_admin', true]);
      
      console.log('👑 Compte admin créé avec succès');
    }
    
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    console.error('❌ Erreur initialisation données:', error.message);
    throw error;
  } finally {
    connection.release();
  }
};

/**
 * Crée toutes les tables et initialise les données
 */
const createAllTables = async () => {
  try {
    console.log('Début de la création des tables...');
    
    // Création des tables dans l'ordre des dépendances
    await createTable('user_management', tableDefinitions.user_management);
    await createTable('user_roles', tableDefinitions.user_roles);
    await createTable('audit_logs', tableDefinitions.audit_logs);
    
    // Initialisation des données
    await seedInitialData();
    
    console.log('🎉 Toutes les opérations terminées avec succès!');
  } catch (error) {
    console.error('💥 Erreur initialisation base de données:', error.message);
    process.exit(1);
  }
};

export default createAllTables;