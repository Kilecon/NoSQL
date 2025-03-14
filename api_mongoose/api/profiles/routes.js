const express = require('express');
const router = express.Router();
const profileController = require('./controllers');

// Routes CRUD principales
router.get('/profiles', profileController.getAllProfiles);
router.get('/profiles/:id', profileController.getProfileById);
router.post('/profiles', profileController.createProfile);
router.put('/profiles/:id', profileController.updateProfile);
router.delete('/profiles/:id', profileController.deleteProfile);

// Routes pour l'expérience
router.post('/profiles/:id/experience', profileController.addExperience);
router.delete('/profiles/:id/experience/:exp', profileController.deleteExperience);

// Routes pour les compétences
router.post('/profiles/:id/skills', profileController.addSkill);
router.delete('/profiles/:id/skills/:skill', profileController.deleteSkill);

// Routes pour les informations
router.put('/profiles/:id/information', profileController.updateInformation);

// Routes pour les amis (bonus)
router.post('/profiles/:id/friends', profileController.addFriend);
router.delete('/profiles/:id/friends/:friendId', profileController.removeFriend);
router.get('/profiles/:id/friends', profileController.getFriends);

module.exports = router;