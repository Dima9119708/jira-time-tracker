import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import axios from 'axios'

const app = express()
const post = process.env.PORT || 8000

app.use(cors({ origin: true, credentials: true }))

app.use(cookieParser())

app.use(express.json())

app.get('/', (req, res) => {
    res.send('Welcome');
});

app.post('/login', async (req, res) => {
    try {
        const email = req.body.email
        const host = req.body.host
        const apiToken = req.body.apiToken

        const encodedAuth = Buffer.from(`${email}:${apiToken}`).toString('base64')

        const response = await axios.get(`${host}/rest/api/2/myself`, {
            headers: {
                Authorization: `Basic ${encodedAuth}`,
            },
        })

        res.cookie('auth', encodedAuth, { httpOnly: true, secure: true, sameSite: 'strict' })
        res.cookie('host', host, { httpOnly: true, secure: true, sameSite: 'strict' })

        res.status(response.status).send(response.data)
    } catch (e) {
        res.status(e.response.status).send(e.response.data)
    }
})

app.get('/auth', async (req, res) => {
    try {
        if (!req.cookies.host || !req.cookies.auth) {
            return res.status(401).send()
        }

        const response = await axios.get(`${req.cookies.host}/rest/api/2/myself`, {
            headers: {
                Authorization: `Basic ${req.cookies.auth}`,
            },
        })

        res.status(response.status).send(response.data)
    } catch (e) {
        res.status(e.response.status).send(e.response.data)
    }
})

app.get('/projects', async (req, res) => {
    try {
        if (!req.cookies.host || !req.cookies.auth) {
            return res.status(401).send()
        }

        const response = await axios.get(`${req.cookies.host}/rest/api/2/project`, {
            headers: {
                Authorization: `Basic ${req.cookies.auth}`,
            },
        })

        res.send(response.data)
    } catch (e) {
        res.status(e.response.status).send(e.response.data)
    }
})

app.get('/tasks', async (req, res) => {
    try {
        if (!req.cookies.host || !req.cookies.auth) {
            return res.status(401).send()
        }

        const response = await axios.get(`${req.cookies.host}/rest/api/2/search?jql=project=${req.query.id} AND assignee=currentUser()&fields=worklog,timetracking,summary,priority`, {
            headers: {
                Authorization: `Basic ${req.cookies.auth}`,
            },
        })

        res.send(response.data)
    } catch (e) {
        res.status(e.response.status).send(e.response.data)
    }
})

app.listen(post, () => {})
