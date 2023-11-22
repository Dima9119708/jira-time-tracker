import express from "express";
import cors from 'cors'

const app = express();
const port = 3000;

app.use(cors({ origin: true, credentials: true }))

app.get('/', (req, res) => {
    res.send('Hello');
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
