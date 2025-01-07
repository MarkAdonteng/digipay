import { Pool } from 'pg';
import * as bcryptjs from 'bcryptjs';

export const pool = new Pool({
  host: 'localhost',
  port: 1533,
  user: 'postgres',
  password: 'm07A21R00k..',
  database: 'Merchant_Digifar'
});

// Add a connection test
pool.connect()
  .then(() => console.log('Database connected successfully'))
  .catch(err => console.error('Database connection error:', err));

export interface UserData {
  username: string;
  password: string;
  phone_number: string;
  security_question: string;
  security_answer: string;
}

export const createUser = async (userData: UserData) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const checkQuery = `
      SELECT username, phone_number FROM users 
      WHERE username = $1 OR phone_number = $2
    `;
    const checkResult = await client.query(checkQuery, [userData.username, userData.phone_number]);
    
    if (checkResult.rows.length > 0) {
      throw new Error(
        checkResult.rows[0].username === userData.username 
          ? 'Username already exists' 
          : 'Phone number already registered'
      );
    }

    const hashedPassword = await bcryptjs.hash(userData.password, 10);
    const hashedSecurityAnswer = await bcryptjs.hash(userData.security_answer, 10);

    const query = `
      INSERT INTO users (username, password, phone_number, security_question, security_answer)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `;

    const values = [
      userData.username,
      hashedPassword,
      userData.phone_number,
      userData.security_question,
      hashedSecurityAnswer
    ];

    const result = await client.query(query, values);
    await client.query('COMMIT');
    return result.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}; 