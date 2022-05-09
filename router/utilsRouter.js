const express = require("express");
const router = express.Router();
const { LANGUAGE_ISO_CODE } = require("../utils/dictionaries");
const { sendMail } = require("../utils/mailFunctions.js");

const {
  detectLanguage,
  translateText,
} = require("../utils/translateFunctions");

router.get("/detect", async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).send("Missing fields");
  }

  const languageDetection = await detectLanguage(text);
  return res.json({
    language: languageDetection[0]?.language,
  });
});

router.get("/translate", async (req, res) => {
  const { text, language } = req.body;

  if (!text || !language) {
    return res.status(400).send("Missing Parametres");
  }

  if (!LANGUAGE_ISO_CODE[language]) {
    return res.status(400).send("Invalid Language");
  }

  const translatedText = await translateText(text, LANGUAGE_ISO_CODE[language]); //here!!
  return res.json({
    translatedText: translatedText[0],
  });
});

router.post("/send", (req, res) => {
   const { senderName, senderMail,senderCountry, receiverCountry, receiverMail, messageContent} = req.body;
    if (!senderName || !senderMail || !senderCountry || !receiverCountry || !receiverMail || !messageContent) {
    return res.status(400).send("Missing Parametres");
  }

  sendMail(
    receiverMail,
    senderMail,
    messageContent,
    `${senderName} has sent you a message`
  );
  res.send(200);
});

module.exports = router;
