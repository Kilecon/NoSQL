const express = require('express');
const router = express.Router();
const profileRoutes = require('./api/profiles/routes');

// API version route
router.get('/', (req, res) => {
  res.json({ message: 'Bienvenue sur l\'API des profils', version: '1.0.0' });
});

// Routes des profils
router.use(profileRoutes);

module.exports = router;
