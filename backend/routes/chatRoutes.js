const express = require('express');
const { LexRuntimeV2Client, RecognizeTextCommand } = require('@aws-sdk/client-lex-runtime-v2');
const router = express.Router();

const BOT_ID = process.env.LEX_BOT_ID || 'your_bot_id';
const BOT_ALIAS_ID = process.env.LEX_BOT_ALIAS_ID || 'your_bot_alias_id';
const LOCALE_ID = process.env.LEX_LOCALE_ID || 'es_US';
const REGION = process.env.LEX_REGION || 'us-east-1';

if (!BOT_ID || !BOT_ALIAS_ID) {
  console.error('ERROR: Faltan variables de entorno para Lex');
  throw new Error('Configuración incompleta de Lex');
}

const lexClient = new LexRuntimeV2Client({ region: REGION });

router.post('/', async (req, res) => {
  const { message, sessionId, moodLevel = 'neutral' } = req.body;

  if (!message || !sessionId) {
    return res.status(400).json({ error: 'Faltan message o sessionId', received: { message, sessionId } });
  }

  try {
    const sessionAttributes = { moodLevel, timestamp: new Date().toISOString() };
    const command = new RecognizeTextCommand({
      botId: BOT_ID,
      botAliasId: BOT_ALIAS_ID,
      localeId: LOCALE_ID,
      sessionId: sessionId,
      text: message,
      sessionState: { sessionAttributes }
    });
    const lexResponse = await lexClient.send(command);
    const botMessage = lexResponse.messages?.[0]?.content || 'No entendí.';
    const intentName = lexResponse.sessionState?.intent?.name;

    res.json({
      message: botMessage,
      sessionId: sessionId,
      moodLevel,
      sessionAttributes: lexResponse.sessionState?.sessionAttributes,
      intent: intentName
    });
  } catch (error) {
    console.error('Error en Lex:', error.message);
    res.status(500).json({ error: 'Error en el chatbot', details: error.message });
  }
});

module.exports = router;