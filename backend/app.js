const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const filesRoutes = require('./routes/filesRoutes');
const moodRoutes = require('./routes/moodRoutes');
const analyzeRoutes = require('./routes/analyzeRoutes');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));  // <--- IMPORTANTE, permite enviar JSON grande

app.use('/api/auth', authRoutes);
app.use('/api/files', filesRoutes);
app.use('/api', moodRoutes);
app.use('/api/analisis', analyzeRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
