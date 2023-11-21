import express from "express";

const main = express();

main.get('/', async (req, res) => {

    try {
        res.send('Hello')
    } catch (e) {
        res.send('ERROR')
    }
});

module.exports = main;
