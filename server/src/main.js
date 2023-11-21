import express from "express";

const app = express();

app.get('/', async (req, res) => {

    try {
        res.send('Hello')
    } catch (e) {
        res.send('ERROR')
    }
});

app.listen(3000, () => {

});

module.exports = app;
