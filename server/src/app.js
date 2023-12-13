import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import axios from 'axios'

const app = express()
const port = process.env.PORT || 8000

app.use(cors({ origin: true, credentials: true }))

app.use(cookieParser())

app.use(express.json())

app.get('/', (req, res) => {
    res.send(`Welcome`)
})

app.post('/login', async (req, res) => {
    try {
        const host = req.body.host ?? req.cookies.host
        const email = req.body.email ?? Buffer.from(`${req.cookies.auth}`, 'base64').toString('ascii').split(':')[0]
        const apiToken = req.body.apiToken ?? Buffer.from(`${req.cookies.auth}`, 'base64').toString('ascii').split(':')[1]

        if (!host || !email || !apiToken) {
            return res.status(401).send('401')
        }

        const encodedAuth = Buffer.from(`${email}:${apiToken}`).toString('base64')

        const response = await axios.get(`${host}/rest/api/2/myself`, {
            headers: {
                Authorization: `Basic ${encodedAuth}`,
            },
        })

        res.cookie('auth', encodedAuth, { httpOnly: true, sameSite: 'strict' })
        res.cookie('host', host)

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

app.get('/statuses-task', async (req, res) => {
    try {
        if (!req.cookies.host || !req.cookies.auth) {
            return res.status(401).send()
        }

        const response = await axios.get(
            `${req.cookies.host}/rest/api/2/issue/${req.query.id}/transitions`,
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

app.get('/tasks', async (req, res) => {
    try {
        if (!req.cookies.host || !req.cookies.auth) {
            return res.status(401).send()
        }

        const response = await axios.get(
            `${req.cookies.host}/rest/api/2/search?jql=project=${req.query.id} AND assignee=currentuser() ${req.query.keys ? `AND NOT issueKey in (${req.query.keys})`: ''} `,
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

app.get('/tracking-tasks', async (req, res) => {
    try {
        if (!req.cookies.host || !req.cookies.auth) {
            return res.status(401).send()
        }

        const response = await axios.get(
            `${req.cookies.host}/rest/api/2/search?jql=project=${req.query.id} AND issueKey in (${req.query.keys})`,
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

app.get('/worklog-task', async (req, res) => {
    try {
        if (!req.cookies.host || !req.cookies.auth) {
            return res.status(401).send()
        }

        const response = await axios.get(
            `${req.cookies.host}/rest/api/3/issue/${req.query.id}/worklog`,
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

app.post('/worklog-task', async (req, res) => {
    try {
        if (!req.cookies.host || !req.cookies.auth) {
            return res.status(401).send()
        }

        const response = await axios.post(
            `${req.cookies.host}/rest/api/3/issue/${req.body.taskId}/worklog`,
            {
                timeSpent: req.body.timeSpent
            },
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

app.put('/worklog-task', async (req, res) => {
    try {
        if (!req.cookies.host || !req.cookies.auth) {
            return res.status(401).send()
        }

        const response = await axios.put(
            `${req.cookies.host}/rest/api/3/issue/${req.body.taskId}/worklog/${req.body.id}`,
            {
                timeSpent: req.body.timeSpent
            },
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

app.post('/change-status-task', async (req, res) => {
    try {
        if (!req.cookies.host || !req.cookies.auth) {
            return res.status(401).send()
        }

        await axios.post(
            `${req.cookies.host}/rest/api/2/issue/${req.body.taskId}/transitions`,
            {
                transition: {
                    id: req.body.transitionId
                }
            },
            {
                headers: {
                    Authorization: `Basic ${req.cookies.auth}`,
                },
            }
        )

        const response = await axios.get(
            `${req.cookies.host}/rest/api/2/issue/${req.body.taskId}`,
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

app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`)
})
