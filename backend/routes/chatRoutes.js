// routes/chatRoutes.js
const express = require('express');
const { LexRuntimeV2Client, RecognizeTextCommand } = require('@aws-sdk/client-lex-runtime-v2');
const router = express.Router();

// === CONFIGURACIÓN DE LEX DESDE .env ===
const BOT_ID = process.env.LEX_BOT_ID;
const BOT_ALIAS_ID = process.env.LEX_BOT_ALIAS_ID;
const LOCALE_ID = process.env.LEX_LOCALE_ID;
const REGION = process.env.LEX_REGION;

// Validar que las variables requeridas existan
if (!BOT_ID || !BOT_ALIAS_ID) {
  console.error('ERROR: Faltan variables de entorno LEX_BOT_ID o LEX_BOT_ALIAS_ID');
  throw new Error('Configuración de Lex incompleta');
}

const lexClient = new LexRuntimeV2Client({ region: REGION });

// === RUTA /chat (POST) ===
router.post('/', async (req, res) => {
  const { message, sessionId, moodLevel = 'neutral' } = req.body;

  if (!message || !sessionId) {
    return res.status(400).json({ 
      error: 'Faltan message o sessionId',
      received: { message, sessionId }
    });
  }

  try {
    const sessionAttributes = { 
      moodLevel,
      timestamp: new Date().toISOString()
    };

    const command = new RecognizeTextCommand({
      botId: BOT_ID,
      botAliasId: BOT_ALIAS_ID,
      localeId: LOCALE_ID,
      sessionId: sessionId,
      text: message,
      sessionState: {
        sessionAttributes: sessionAttributes
      }
    });

    const response = await lexClient.send(command);
    const botMessage = response.messages?.[0]?.content || 'No entendí.';

    res.json({
      message: botMessage,
      sessionId: sessionId,
      moodLevel,
      sessionAttributes: response.sessionState?.sessionAttributes
    });
    
  } catch (error) {
    console.error('Error en Lex:', error.message);
    
    res.status(500).json({ 
      error: 'Error en el chatbot', 
      details: error.message,
      type: error.name
    });
  }
});

module.exports = router;
