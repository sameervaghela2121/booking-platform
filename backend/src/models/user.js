const db = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
  static async create(firstName, lastName, email, password) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const verificationToken = Math.random().toString(36).substring(2, 15);
      
      console.log('Creating user with data:', {
        firstName,
        lastName,
        email,
        verificationToken
      });

      const [result] = await db.execute(
        'INSERT INTO users (first_name, last_name, email, password, verification_token, is_verified) VALUES (?, ?, ?, ?, ?, ?)',
        [firstName, lastName, email, hashedPassword, verificationToken, false]
      );
      
      console.log('User creation result:', result);
      return { id: result.insertId, verificationToken };
    } catch (error) {
      console.error('Error in User.create:', error);
      throw error;
    }
  }

  static async findByEmail(email) {
    try {
      console.log('Finding user by email:', email);
      const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
      console.log('Find by email result:', rows[0] ? 'User found' : 'User not found');
      return rows[0];
    } catch (error) {
      console.error('Error in User.findByEmail:', error);
      throw error;
    }
  }

  static async verifyEmail(token) {
    try {
      console.log('Verifying email with token:', token);
      const [result] = await db.execute(
        'UPDATE users SET is_verified = true, verification_token = NULL WHERE verification_token = ?',
        [token]
      );
      console.log('Verification result:', { affectedRows: result.affectedRows });
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error in User.verifyEmail:', error);
      throw error;
    }
  }
}

module.exports = User;
