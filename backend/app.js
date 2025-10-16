const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const moodRoutes = require('./routes/moodRoutes');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));  // <--- IMPORTANTE, permite enviar JSON grande

app.use('/api/auth', authRoutes);
app.use('/api', moodRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
