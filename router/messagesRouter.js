const express = require('express');
const mysql = require('mysql');
const connection = require('../db');
const { detectLanguage, translateText, } = require("../utils/translateFunctions.js");
const { LANGUAGE_ISO_CODE } = require("../utils/dictionaries.js");
const { sendMail } = require("../utils/mailFunctions.js");

const buildInsertQueryString = (senderName, senderMail, senderCountry, receiverCountry, receiverMail, messageContent) => {
    const queryString = `INSERT INTO messages2 (senderName, senderMail, senderCountry, receiverCountry, receiverMail, messageContent) values (${mysql.escape(senderName)}, ${mysql.escape(senderMail)}, ${mysql.escape(senderCountry)}, ${mysql.escape( receiverCountry)}, ${mysql.escape(receiverMail)}, ${mysql.escape(messageContent)})`;
    return queryString;
};

const router = express.Router();

// Get all messages
router.get("/", (req, res) => {
    connection.query("SELECT * FROM messages2", (err, results) => {
        if (err) {
            console.log(err);
            return res.send(err);
        }

        return res.json({
            messages: results,
        })
    })
});

// Get a message by id
router.get("/:id", (req, res) => {
    const { id } = req.params;
    if (!id) {
        // send bad request error
        return res.status(400).send("Bad request. Missing parametres.");
    }
    const queryString = `SELECT * FROM messages2 WHERE entryID = ${mysql.escape(id)}`;
    connection.query(queryString, (err, results) => {
        if (err) {
            return res.send(err);
        }
        if (results.length === 0) {
            return res.status(404).send("Message not found.");
        }
        return res.json({
            messages: results,
        });
    }
    );
}
);

// Insert a new message
router.post("/", (req, res) => {
    console.log(req.body);
    const {
        senderName,
        senderMail,
        senderCountry,
        receiverCountry,
        receiverMail,
        messageContent,
    } = req.body;

    if (!senderName || !senderMail || !senderCountry || !receiverCountry || !receiverMail || !messageContent) {
        return res.status(400).json({
            error: "All fields are required",
        })
    }

    connection.query(`INSERT INTO messages2 (senderName, senderMail, senderCountry, receiverCountry, receiverMail, messageContent) values (${mysql.escape(senderName)}, ${mysql.escape(senderMail)}, ${mysql.escape(senderCountry)}, ${mysql.escape( receiverCountry)}, ${mysql.escape(receiverMail)}, ${mysql.escape(messageContent)})`, (err, results) => {
        if (err) {
            console.log(err);
            return res.send(err);
        }

        return res.json({
            results,
        })
    })

});

// Delete a message
router.delete("/:id", (req, res) => {
    const { id } = req.params;
    connection.query(`DELETE FROM messages2 where entryID = ${mysql.escape(id)}`, (err, results) => {
        if (err) {
            console.log(err);
            return res.send(err);
        }
        return res.json({
            results,
        })
    })
});

router.put("/:id", (req, res) => {
    const { id } = req.params;
    const {
        senderName,
        senderMail,
        senderCountry,
        receiverCountry,
        receiverMail,
        messageContent,
    } = req.body;

    if (!senderName || !senderMail || !senderCountry || !receiverCountry || !receiverMail || !messageContent) {
        return res.status(400).json({
            error: "All fields are required",
        })
    }

    connection.query(`UPDATE messages2 SET senderName = ${mysql.escape(senderName)}, senderMail = ${mysql.escape(senderMail)},  senderCountry = ${mysql.escape(senderCountry)},  receiverCountry = ${mysql.escape(receiverCountry)}, receiverMail = ${mysql.escape(receiverMail)}, messageContent = ${mysql.escape(messageContent)} WHERE entryID = ${mysql.escape(id)}`, (err, results) => {
        if (err) {
            console.log(err);
            return res.send(err);
        }
        return res.json({
            results,
        })
    })
});

router.post("/foreign", async (req, res) => {
    const { senderName, senderMail, senderCountry, receiverCountry, receiverMail, messageContent, language } = req.body;
    if (!senderName || !senderMail || !senderCountry || !receiverCountry || !receiverMail || !messageContent || !language) {
        return res.status(400).send("Bad request. Missing parametres.");
    }
    let translationData = {};

    const queryString = buildInsertQueryString(senderName, senderMail,senderCountry, receiverCountry, receiverMail, messageContent);

    try {
        //for all languages
        if (language === "ALL") {
            const originalLanguageResponse = await detectLanguage(messageContent);
            translationData.originalLanguage = originalLanguageResponse[0]?.language;
            const availableLanguages = Object.values(LANGUAGE_ISO_CODE);

            const translatedAnswersArray = await Promise.all(
                availableLanguages.map(async (language) => {
                    const translatedTextResponse = await translateText(messageContent, language);
                    return translatedTextResponse[0];
                })
            );
            translationData.translatedText = translatedAnswersArray.reduce(
                (acc, curr) => {
                    return acc + curr + "\n";
                },
                ""
            );
        }
        else if (LANGUAGE_ISO_CODE[language]) {
            const originalLanguageResponse = await detectLanguage(messageContent);
            translationData.originalLanguage = originalLanguageResponse[0]?.language;

            const translatedTextResponse = await translateText(
                messageContent,
                LANGUAGE_ISO_CODE[language]
            );
            translationData.translatedText = translatedTextResponse[0];
        }
        else {
            return res.send("Language not supported");
        }

        //send with sendgrid
        sendMail(
            receiverMail,
            senderMail,
            senderName + "" + " sent you a message",
            translationData.translatedText
        );

        // insert orginal message in database
        connection.query(queryString, (err, results) => {
            if (err) {
                return res.send(err);
            }

            return res.json({
                translationData,
            });
        });
    } catch (err) {
        console.log(err);
        return res.send("Something went wrong");
    }
});

module.exports = router;