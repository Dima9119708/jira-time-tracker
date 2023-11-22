import express from "express";
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express();
const port = 3000;

app.use(cors({ origin: true, credentials: true }))

app.use(cookieParser())

app.use(express.json())

app.get('/test', (req, res) => {
    res.send('Hello');
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
