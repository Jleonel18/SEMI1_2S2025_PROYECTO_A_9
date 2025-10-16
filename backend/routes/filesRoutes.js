const express = require('express');
const router = express.Router();
const file = require('../controllers/filesController');
const authenticateToken = require('../middlewares/authMiddleware');

router.post('/upload', authenticateToken ,file.uploadFile);

module.exports = router;
