const express = require('express');
const app = express();
const cors = require('cors');
const db = require('./database');
const bcrypt = require('bcrypt');

// Middleware to parse request body
app.use(express.json());
app.use(cors());

// Route for user signup
// Route for user signup
app.get('/signup/:email/:password', async (req, res) => {
    try {
      const email = req.params.email;
      const password = req.params.password;
  
      // Check if a user with the same email already exists
      db.get('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], async (err, row) => {
        if (err) {
          console.error('Error fetching user:', err.message);
          res.status(500).json({ error: 'Failed to register user' });
        } else if (row) {
          // User already exists with the same email
          res.status(409).json({ error: 'User with this email already exists' });
        } else {
          // Insert the new user into the database
          db.run('INSERT INTO users (email, password) VALUES (?, ?)', [email, password], (err) => {
            if (err) {
              console.error('Error inserting data:', err.message);
              res.status(500).json({ error: 'Failed to register user' });
            } else {
              console.log('User data inserted successfully.');
              res.status(201).json({ message: 'User registered successfully' });
            }
          });
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to register user' });
    }
  });
  

// Route for user login
app.get('/login/:email/:password', async (req, res) => {
  console.log('1');
  try {
    const email = req.params.email;
    const password = req.params.password;

    // Find the user in the database by email
    db.get('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], async (err, row) => {
      if (err) {
        console.error('Error fetching user:', err.message);
        res.status(500).json({ error: 'Failed to login' });
      } else if (!row) {
        // User not found
        res.status(404).json({ error: 'User not found' });
      } else {
        console.log('User found');
        res.json({ Correct: 'User found' });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to login' });
  }
});
// Start the server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
