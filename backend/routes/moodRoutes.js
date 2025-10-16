const express = require('express');
const router = express.Router();
const moodController = require('../controllers/moodController');

router.post('/save-mood', moodController.saveMood);
router.get('/get-history', moodController.getHistory);

module.exports = router;
