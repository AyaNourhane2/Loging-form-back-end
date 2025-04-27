// dbUtils.js
import { pool } from '../config/db.js';
import bcrypt from 'bcryptjs';

const tableDefinitions = {
  users: `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) NOT NULL UNIQUE,
      email VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      mobile VARCHAR(20),
      userType ENUM('admin','user') NOT NULL DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_email (email),
      INDEX idx_userType (userType)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `,

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
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_user_type (user_type),
      INDEX idx_is_active (is_active)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `,

  user_roles: `
    CREATE TABLE IF NOT EXISTS user_roles (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      role_name VARCHAR(50) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE KEY unique_user_role (user_id, role_name)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `,

  rooms: `
    CREATE TABLE IF NOT EXISTS rooms (
      id INT AUTO_INCREMENT PRIMARY KEY,
      room_number VARCHAR(10) NOT NULL UNIQUE,
      room_type VARCHAR(50) NOT NULL,
      status ENUM('available','occupied','maintenance','reserved') NOT NULL DEFAULT 'available',
      price_per_night DECIMAL(10,2) NOT NULL,
      capacity INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_room_type (room_type),
      INDEX idx_status (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `,

  reservations: `
    CREATE TABLE IF NOT EXISTS reservations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      room_id INT NOT NULL,
      check_in DATE NOT NULL,
      check_out DATE NOT NULL,
      status ENUM('confirmed','cancelled','completed') NOT NULL DEFAULT 'confirmed',
      total_price DECIMAL(10,2) NOT NULL,
      special_requests TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (room_id) REFERENCES rooms(id),
      INDEX idx_dates (check_in, check_out),
      INDEX idx_status (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `,

  housekeeping: `
    CREATE TABLE IF NOT EXISTS housekeeping (
      id INT AUTO_INCREMENT PRIMARY KEY,
      room_id INT NOT NULL,
      status ENUM('clean','dirty','in_progress','inspected') NOT NULL DEFAULT 'clean',
      staff_id INT,
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (room_id) REFERENCES rooms(id),
      FOREIGN KEY (staff_id) REFERENCES users(id),
      INDEX idx_status (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `
};

export async function initializeDatabase() {
  const conn = await pool.getConnection();
  try {
    console.log('Starting database initialization...');
    
    // Désactiver les contraintes FK temporairement
    await conn.query('SET FOREIGN_KEY_CHECKS = 0');

    // Créer les tables dans l'ordre
    const creationOrder = [
      'users',
      'user_management',
      'rooms',
      'user_roles',
      'reservations',
      'housekeeping'
    ];

    for (const table of creationOrder) {
      try {
        console.log(`Creating ${table} table...`);
        await conn.query(`DROP TABLE IF EXISTS ${table}`);
        await conn.query(tableDefinitions[table]);
        console.log(`✅ ${table} table created successfully`);
      } catch (error) {
        console.error(`❌ Failed to create ${table} table:`, error.message);
        throw error;
      }
    }

    // Réactiver les contraintes FK
    await conn.query('SET FOREIGN_KEY_CHECKS = 1');

    // Ajouter les données initiales
    await seedInitialData(conn);
    
    console.log('🎉 Database initialized successfully!');
  } finally {
    conn.release();
  }
}

async function seedInitialData(conn) {
  try {
    // Vérifier si l'admin existe déjà
    const [admin] = await conn.query('SELECT id FROM users WHERE userType = "admin" LIMIT 1');
    
    if (!admin || admin.length === 0) {
      const hashedPassword = await bcrypt.hash('Admin123!', 10);
      await conn.query(
        `INSERT INTO users 
        (username, email, password, userType) 
        VALUES (?, ?, ?, ?)`,
        ['admin', 'admin@example.com', hashedPassword, 'admin']
      );
      console.log('👑 Admin account created');
    }

    // Ajouter un utilisateur de test
    const [testUser] = await conn.query('SELECT id FROM users WHERE email = "user@example.com" LIMIT 1');
    if (!testUser || testUser.length === 0) {
      const hashedUserPassword = await bcrypt.hash('User123!', 10);
      await conn.query(
        `INSERT INTO users 
        (username, email, password, userType, mobile) 
        VALUES (?, ?, ?, ?, ?)`,
        ['testuser', 'user@example.com', hashedUserPassword, 'user', '0612345678']
      );
      console.log('👤 Test user account created');
    }

    // Ajouter des chambres par défaut
    await conn.query(`
      INSERT IGNORE INTO rooms 
      (room_number, room_type, status, price_per_night, capacity) 
      VALUES 
        ('101', 'standard', 'available', 99.99, 2),
        ('201', 'deluxe', 'available', 149.99, 2),
        ('301', 'suite', 'available', 249.99, 4)
    `);
  } catch (error) {
    console.error('Error seeding initial data:', error);
    throw error;
  }
}

export async function checkDatabaseConnection() {
  try {
    await pool.query('SELECT 1');
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

export default {
  initializeDatabase,
  checkDatabaseConnection
};