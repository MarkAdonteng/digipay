import express from 'express';
import cors from 'cors';
import { createUser, UserData } from './db';
import { pool } from './db';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();
const port = 3000;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

app.post('/api/users', async (req, res) => {
  try {
    const userData: UserData = req.body;
    const result = await createUser(userData);
    res.json({ success: true, userId: result.id });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'An error occurred' 
    });
  }
});

app.post('/api/users/verify-phone', async (req, res) => {
  const client = await pool.connect();
  try {
    const { phone_number } = req.body;
    
    // Convert international format to local format
    const localPhoneNumber = phone_number.startsWith('233') 
      ? '0' + phone_number.slice(3) 
      : phone_number;
    
    console.log('Checking phone number:', localPhoneNumber); // Debug log
    
    const query = 'SELECT security_question FROM users WHERE phone_number = $1';
    const result = await client.query(query, [localPhoneNumber]);
    
    if (result.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'This phone number is not registered in our system'
      });
    }

    console.log('Found user:', result.rows[0]); // Debug log

    res.json({
      success: true,
      securityQuestion: result.rows[0].security_question
    });
  } catch (error) {
    console.error('Database error:', error); // Debug log
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  } finally {
    client.release();
  }
});

app.post('/api/users/verify-security', async (req, res) => {
  const client = await pool.connect();
  try {
    const { phone_number, security_answer } = req.body;
    
    const query = 'SELECT security_answer FROM users WHERE phone_number = $1';
    const result = await client.query(query, [phone_number]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const isValid = await bcryptjs.compare(security_answer, result.rows[0].security_answer);
    
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid security answer'
      });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  } finally {
    client.release();
  }
});

app.post('/api/users/update-password', async (req, res) => {
  const client = await pool.connect();
  try {
    const { phone_number, new_password } = req.body;
    
    console.log('Checking password for:', phone_number); // Debug log
    
    // First check if new password is same as old password
    const checkQuery = 'SELECT password FROM users WHERE phone_number = $1';
    const checkResult = await client.query(checkQuery, [phone_number]);
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const oldPasswordHash = checkResult.rows[0].password;
    console.log('Comparing passwords...'); // Debug log
    const isSamePassword = await bcryptjs.compare(new_password, oldPasswordHash);
    console.log('Is same password:', isSamePassword); // Debug log
    
    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: 'New password must be different from the current password'
      });
    }

    // If password is different, update it
    const hashedPassword = await bcryptjs.hash(new_password, 10);
    const updateQuery = 'UPDATE users SET password = $1 WHERE phone_number = $2 RETURNING id';
    const result = await client.query(updateQuery, [hashedPassword, phone_number]);
    
    console.log('Password updated successfully'); // Debug log
    res.json({ success: true });
  } catch (error) {
    console.error('Password update error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  } finally {
    client.release();
  }
});

app.post('/api/login', async (req, res) => {
  const client = await pool.connect();
  try {
    const { username, password } = req.body;
    console.log('Login attempt:', { username }); // Debug log

    const result = await client.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    const user = result.rows[0];
    const isValidPassword = await bcryptjs.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      'your-secret-key',
      { expiresIn: '24h' }
    );

    // Remove password from response
    delete user.password;

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        phone_number: user.phone_number
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during login'
    });
  } finally {
    client.release();
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
}); 