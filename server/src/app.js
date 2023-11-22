import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import axios from 'axios'

const server = express()
const port = process.env.PORT || 3000

server.use(cors({ origin: true, credentials: true }))

server.use(cookieParser())

server.use(express.json())

server.get('/', (req, res) => {
    res.send(`
    <html>
      <head>
        <style>
          @font-face {
            font-family: "Sora";
            src: url("https://example.com/fonts/sora/Sora-SemiBold.ttf");
            font-style: normal;
            font-weight: 600;
            font-display: swap;
          }
          /* The rest of your @font-face rules... */

          .btn-primary {
            background-color: green;
            color: white;
            border-radius: 0.25rem;
            height: 2.25rem;
          }
          /* The rest of your CSS rules... */

          body {
            background-color: #10203A;
            color: #fff;
            font-family: Sora, Arial, sans-serif;
            text-align: center;
            height: 100vh;
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        </style>
      </head>
      <body>
        <h1>Welcome to Back4server Containerssacsa</h1>
      </body>
    </html>
  `)
})

server.post('/login', async (req, res) => {
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

        res.cookie('auth', encodedAuth, { httpOnly: true, sameSite: 'strict' })

        res.status(response.status).send(response.data)
    } catch (e) {
        res.status(e.response.status).send(e.response.data)
    }
})

server.get('/auth', async (req, res) => {
    try {
        if (!req.cookies.host || !req.cookies.auth) {
            return res.status(401).send('401')
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

server.get('/projects', async (req, res) => {
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

server.get('/tasks', async (req, res) => {
    try {
        if (!req.cookies.host || !req.cookies.auth) {
            return res.status(401).send()
        }

        const response = await axios.get(
            `${req.cookies.host}/rest/api/2/search?jql=project=${req.query.id} AND assignee=currentUser()&fields=worklog,timetracking,summary,priority`,
            {
                headers: {
                    Authorization: `Basic ${req.cookies.auth}`,
                },
            }
        )

        res.send(response.data)
    } catch (e) {
        res.status(e.response.status).send(e.response.data)
    }
})

server.listen(port, () => {
    console.log(`server listening at http://localhost:${port}`)
})
