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
        const jiraSubDomain = req.body.jirasubdomain ?? req.headers.jirasubdomain
        const encodedAuth = req.body.encodedauth ?? req.headers.encodedauth

        if (!jiraSubDomain || !encodedAuth) {
            return res.status(401).send('401')
        }

        const response = await axios.get(`${jiraSubDomain}/rest/api/2/myself`, {
            headers: {
                Authorization: `Basic ${encodedAuth}`,
            },
        })

        res.status(response.status).send(response.data)
    } catch (e) {
        res.status(e.response.status).send(e.response.data)
    }
})

app.get('/projects', async (req, res) => {
    try {
        if (!req.headers.jirasubdomain || !req.headers.encodedauth) {
            return res.status(401).send()
        }

        const response = await axios.get(`${req.headers.jirasubdomain}/rest/api/2/project`, {
            headers: {
                Authorization: `Basic ${req.headers.encodedauth}`,
            },
        })

        res.send(response.data)
    } catch (e) {
        res.status(e.response.status).send(e.response.data)
    }
})

app.get('/statuses-task', async (req, res) => {
    try {
        if (!req.headers.jirasubdomain || !req.headers.encodedauth) {
            return res.status(401).send()
        }

        const response = await axios.get(
            `${req.headers.jirasubdomain}/rest/api/2/issue/${req.query.id}/transitions`,
            {
                headers: {
                    Authorization: `Basic ${req.headers.encodedauth}`,
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
        if (!req.headers.jirasubdomain || !req.headers.encodedauth) {
            return res.status(401).send()
        }

        const response = await axios.get(
            `${req.headers.jirasubdomain}/rest/api/3/search`,
            {
                headers: {
                    Authorization: `Basic ${req.headers.encodedauth}`,
                },
                params: req.query
            }
        )

        res.send(response.data)
    } catch (e) {
        res.status(e.response.status).send(e.response.data)
    }
})

app.get('/issue', async (req, res) => {
    try {
        if (!req.headers.jirasubdomain || !req.headers.encodedauth) {
            return res.status(401).send()
        }

        const response = await axios.get(
            `${req.headers.jirasubdomain}/rest/api/2/issue/${req.query.id}`,
            {
                headers: {
                    Authorization: `Basic ${req.headers.encodedauth}`,
                },
            }
        )

        res.send(response.data)
    } catch (e) {
        res.status(e.response.status).send(e.response.data)
    }
})

app.get('/issue-assignable', async (req, res) => {
    try {
        if (!req.headers.jirasubdomain || !req.headers.encodedauth) {
            return res.status(401).send()
        }

        const response = await axios.get(
            `${req.headers.jirasubdomain}/rest/api/3/user/assignable/search?issueKey=${req.query.id}`,
            {
                headers: {
                    Authorization: `Basic ${req.headers.encodedauth}`,
                },
            }
        )

        res.send(response.data)
    } catch (e) {
        res.status(e.response.status).send(e.response.data)
    }
})

app.put('/issue-assignee', async (req, res) => {
    try {
        if (!req.headers.jirasubdomain || !req.headers.encodedauth) {
            return res.status(401).send()
        }

        const response = await axios.put(
            `${req.headers.jirasubdomain}/rest/api/3/issue/${req.query.id}/assignee`,
            req.body,
            {
                headers: {
                    Authorization: `Basic ${req.headers.encodedauth}`,
                },
            }
        )

        res.send(response.data)
    } catch (e) {
        res.status(e.response.status).send(e.response.data)
    }
})

app.get('/issue-comment', async (req, res) => {
    try {
        if (!req.headers.jirasubdomain || !req.headers.encodedauth) {
            return res.status(401).send()
        }

        const response = await axios.get(
            `${req.headers.jirasubdomain}/rest/api/3/issue/${req.query.id}/comment`,
            {
                headers: {
                    Authorization: `Basic ${req.headers.encodedauth}`,
                },
            }
        )

        res.send(response.data)
    } catch (e) {
        res.status(e.response.status).send(e.response.data)
    }
})

app.get('/filters', async (req, res) => {
    try {
        if (!req.headers.jirasubdomain || !req.headers.encodedauth) {
            return res.status(401).send()
        }

        const response = await axios.get(
          `${req.headers.jirasubdomain}/rest/api/3/filter/search?filterName=${req.query.filterValue}`,
          {
              headers: {
                  Authorization: `Basic ${req.headers.encodedauth}`,
              },
          }
        )

        res.send(response.data)
    } catch (e) {
        res.status(e.response.status).send(e.response.data)
    }
})

app.get('/filter-details', async (req, res) => {
    try {
        if (!req.headers.jirasubdomain || !req.headers.encodedauth) {
            return res.status(401).send()
        }

        const response = await axios.get(
          `${req.headers.jirasubdomain}/rest/api/3/filter/${req.query.id}`,
          {
              headers: {
                  Authorization: `Basic ${req.headers.encodedauth}`,
              },
          }
        )

        res.send(response.data)
    } catch (e) {
        res.status(e.response.status).send(e.response.data)
    }
})

app.post('/filter-details', async (req, res) => {
    try {
        if (!req.headers.jirasubdomain || !req.headers.encodedauth) {
            return res.status(401).send()
        }

        const response = await axios.post(
          `${req.headers.jirasubdomain}/rest/api/3/filter`,
          req.body,
          {
              headers: {
                  Authorization: `Basic ${req.headers.encodedauth}`,
              },
          }
        )

        res.send(response.data)
    } catch (e) {
        res.status(e.response.status).send(e.response.data)
    }
})

app.put('/filter-details', async (req, res) => {
    try {
        if (!req.headers.jirasubdomain || !req.headers.encodedauth) {
            return res.status(401).send()
        }

        const response = await axios.put(
          `${req.headers.jirasubdomain}/rest/api/3/filter/${req.query.id}`,
          req.body,
          {
              headers: {
                  Authorization: `Basic ${req.headers.encodedauth}`,
              },
          }
        )

        res.send(response.data)
    } catch (e) {
        res.status(e.response.status).send(e.response.data)
    }
})

app.post('/jql-search', async (req, res) => {
    try {
        if (!req.headers.jirasubdomain || !req.headers.encodedauth) {
            return res.status(401).send()
        }

        const response = await axios.post(
          `${req.headers.jirasubdomain}${req.query.url}`,
          req.body,
          {
              headers: {
                  Authorization: `Basic ${req.headers.encodedauth}`,
              },
          }
        )

        res.send(response.data)
    } catch (e) {
        res.status(e.response.status).send(e.response.data)
    }
})

app.get('/jql-search', async (req, res) => {
    try {
        if (!req.headers.jirasubdomain || !req.headers.encodedauth) {
            return res.status(401).send()
        }

        const response = await axios.get(
          `${req.headers.jirasubdomain}${req.query.url}`,
          {
              headers: {
                  Authorization: `Basic ${req.headers.encodedauth}`,
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
        if (!req.headers.jirasubdomain || !req.headers.encodedauth) {
            return res.status(401).send()
        }

        const response = await axios.get(
            `${req.headers.jirasubdomain}/rest/api/2/search`,
            {
                headers: {
                    Authorization: `Basic ${req.headers.encodedauth}`,
                },
                params: req.query
            }
        )

        res.send(response.data)
    } catch (e) {
        res.status(e.response.status).send(e.response.data)
    }
})

app.get('/worklog-task', async (req, res) => {
    try {
        if (!req.headers.jirasubdomain || !req.headers.encodedauth) {
            return res.status(401).send()
        }

        const response = await axios.get(
            `${req.headers.jirasubdomain}/rest/api/3/issue/${req.query.id}/worklog`,
            {
                headers: {
                    Authorization: `Basic ${req.headers.encodedauth}`,
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
        if (!req.headers.jirasubdomain || !req.headers.encodedauth) {
            return res.status(401).send()
        }

        const response = await axios.post(
            `${req.headers.jirasubdomain}/rest/api/3/issue/${req.body.taskId}/worklog`,
            {
                timeSpent: req.body.timeSpent
            },
            {
                headers: {
                    Authorization: `Basic ${req.headers.encodedauth}`,
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
        if (!req.headers.jirasubdomain || !req.headers.encodedauth) {
            return res.status(401).send()
        }

        const response = await axios.put(
            `${req.headers.jirasubdomain}/rest/api/3/issue/${req.body.taskId}/worklog/${req.body.id}`,
            {
                timeSpent: req.body.timeSpent
            },
            {
                headers: {
                    Authorization: `Basic ${req.headers.encodedauth}`,
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
        if (!req.headers.jirasubdomain || !req.headers.encodedauth) {
            return res.status(401).send()
        }

        await axios.post(
            `${req.headers.jirasubdomain}/rest/api/2/issue/${req.body.taskId}/transitions`,
            {
                transition: {
                    id: req.body.transitionId
                }
            },
            {
                headers: {
                    Authorization: `Basic ${req.headers.encodedauth}`,
                },
            }
        )

        const response = await axios.get(
            `${req.headers.jirasubdomain}/rest/api/2/issue/${req.body.taskId}`,
            {
                headers: {
                    Authorization: `Basic ${req.headers.encodedauth}`,
                },
            }
        )

        res.send(response.data)
    } catch (e) {
        res.status(e.response.status).send(e.response.data)
    }
})

app.listen(port)
