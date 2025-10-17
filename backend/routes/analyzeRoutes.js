const express = require('express');
const router = express.Router();
const analyzeController = require('../controllers/analyzeController');
const authenticateToken = require('../middlewares/authMiddleware');


router.post('/guardar-analisis',authenticateToken, analyzeController.guardarAnalisis);

module.exports = router;