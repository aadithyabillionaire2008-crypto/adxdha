const express = require('express');
const bcrypt = require('bcryptjs');
const { db } = require('../../database/db');
const { sign } = require('../middleware/auth');
const router = express.Router();
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user || !bcrypt.compareSync(password, user.password_hash)) return res.status(401).json({ error: 'Invalid email or password' });
  res.json({ token: sign(user), user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});
module.exports = router;
