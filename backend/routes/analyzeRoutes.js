const express = require('express');
const router = express.Router();
const analyzeController = require('../controllers/analyzeController');
const authenticateToken = require('../middlewares/authMiddleware');


router.post('/guardar-analisis',authenticateToken, analyzeController.guardarAnalisis);
router.get('/get-user-analyses', authenticateToken, analyzeController.getUserAnalyses);

module.exports = router;