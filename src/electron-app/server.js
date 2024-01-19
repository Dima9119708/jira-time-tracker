const express = require('express')
const cors = require('cors')
const axios = require('axios')
const keytar = require('keytar')
const { NAME_PROJECT, AUTH_DATA, BASIC_AUTH, OAUTH2 } = require('./constans')

const getParsedAuth = async () => {
    const authData = await keytar.getPassword(NAME_PROJECT, AUTH_DATA)
    return JSON.parse(authData)
}

const server = (port, errorCallback) => {
    return new Promise((resolve) => {
        try {
            const app = express()

            app.use(cors())

            app.use(express.json())

            app.get('/login', async (req, res) => {
                try {
                    const authParsed = await getParsedAuth()

                    if (authParsed.type === BASIC_AUTH) {
                        const response = await axios.get(`${authParsed.jiraSubDomain}/rest/api/2/myself`, {
                            headers: {
                                Authorization: `Basic ${authParsed.apiToken}`,
                            },
                        })

                        res.send(response.data)
                    }

                    if (authParsed.type === OAUTH2) {
                        const response = await axios.get(`https://api.atlassian.com/ex/jira/${authParsed.client_id}/rest/api/2/myself`, {
                            headers: {
                                Authorization: `Bearer ${authParsed.access_token}`,
                            },
                        })

                        res.send(response.data)
                    }
                } catch (e) {
                    if (e instanceof TypeError) {
                        return errorCallback(e.message)
                    }

                    res.status(e.response.status).send(e.response.data)
                }
            })

            app.get('/statuses-task', async (req, res) => {
                try {
                    const authParsed = await getParsedAuth()

                    if (authParsed.type === BASIC_AUTH) {
                        const response = await axios.get(`${authParsed.jiraSubDomain}/rest/api/2/issue/${req.query.id}/transitions`, {
                            headers: {
                                Authorization: `Basic ${authParsed.apiToken}`,
                            },
                        })

                        res.send(response.data)
                    }

                    if (authParsed.type === OAUTH2) {
                        const response = await axios.get(
                            `https://api.atlassian.com/ex/jira/${authParsed.client_id}/rest/api/2/issue/${req.query.id}/transitions`,
                            {
                                headers: {
                                    Authorization: `Bearer ${authParsed.access_token}`,
                                },
                            }
                        )

                        res.send(response.data)
                    }
                } catch (e) {
                    if (e instanceof TypeError) {
                        return errorCallback(e.message)
                    }

                    res.status(e.response.status).send(e.response.data)
                }
            })

            app.get('/tasks', async (req, res) => {
                try {
                    const authParsed = await getParsedAuth()

                    if (authParsed.type === BASIC_AUTH) {
                        const response = await axios.get(`${authParsed.jiraSubDomain}/rest/api/3/search`, {
                            headers: {
                                Authorization: `Basic ${authParsed.apiToken}`,
                            },
                            params: req.query,
                        })

                        res.send(response.data)
                    }

                    if (authParsed.type === OAUTH2) {
                        const response = await axios.get(`https://api.atlassian.com/ex/jira/${authParsed.client_id}/rest/api/2/search`, {
                            headers: {
                                Authorization: `Bearer ${authParsed.access_token}`,
                            },
                            params: req.query,
                        })

                        res.send(response.data)
                    }
                } catch (e) {
                    if (e instanceof TypeError) {
                        return errorCallback(e.message)
                    }

                    res.status(e.response.status).send(e.response.data)
                }
            })

            app.get('/issue', async (req, res) => {
                try {
                    const authParsed = await getParsedAuth()

                    if (authParsed.type === BASIC_AUTH) {
                        const response = await axios.get(`${authParsed.jiraSubDomain}/rest/api/2/issue/${req.query.id}`, {
                            headers: {
                                Authorization: `Basic ${authParsed.apiToken}`,
                            },
                        })

                        res.send(response.data)
                    }

                    if (authParsed.type === OAUTH2) {
                        const response = await axios.get(
                            `https://api.atlassian.com/ex/jira/${authParsed.client_id}/rest/api/2/issue/${req.query.id}`,
                            {
                                headers: {
                                    Authorization: `Bearer ${authParsed.access_token}`,
                                },
                            }
                        )

                        res.send(response.data)
                    }
                } catch (e) {
                    if (e instanceof TypeError) {
                        return errorCallback(e.message)
                    }

                    res.status(e.response.status).send(e.response.data)
                }
            })

            app.get('/issue-assignable', async (req, res) => {
                try {
                    const authParsed = await getParsedAuth()

                    if (authParsed.type === BASIC_AUTH) {
                        const response = await axios.get(
                            `${authParsed.jiraSubDomain}/rest/api/3/user/assignable/search?issueKey=${req.query.id}`,
                            {
                                headers: {
                                    Authorization: `Basic ${authParsed.apiToken}`,
                                },
                            }
                        )

                        res.send(response.data)
                    }

                    if (authParsed.type === OAUTH2) {
                        const response = await axios.get(
                            `https://api.atlassian.com/ex/jira/${authParsed.client_id}/rest/api/3/user/assignable/search?issueKey=${req.query.id}`,
                            {
                                headers: {
                                    Authorization: `Bearer ${authParsed.access_token}`,
                                },
                            }
                        )

                        res.send(response.data)
                    }
                } catch (e) {
                    if (e instanceof TypeError) {
                        return errorCallback(e.message)
                    }

                    res.status(e.response.status).send(e.response.data)
                }
            })

            app.put('/issue-assignee', async (req, res) => {
                try {
                    const authParsed = await getParsedAuth()

                    if (authParsed.type === BASIC_AUTH) {
                        const response = await axios.put(
                            `${authParsed.jiraSubDomain}/rest/api/3/issue/${req.query.id}/assignee`,
                            req.body,
                            {
                                headers: {
                                    Authorization: `Basic ${authParsed.apiToken}`,
                                },
                            }
                        )

                        res.send(response.data)
                    }

                    if (authParsed.type === OAUTH2) {
                        const response = await axios.put(
                            `https://api.atlassian.com/ex/jira/${authParsed.client_id}/rest/api/3/user/assignable/search?issueKey=${req.query.id}`,
                            {
                                headers: {
                                    Authorization: `Bearer ${authParsed.access_token}`,
                                },
                            }
                        )

                        res.send(response.data)
                    }
                } catch (e) {
                    if (e instanceof TypeError) {
                        return errorCallback(e.message)
                    }

                    res.status(e.response.status).send(e.response.data)
                }
            })

            app.get('/filters', async (req, res) => {
                try {
                    const authParsed = await getParsedAuth()

                    if (authParsed.type === BASIC_AUTH) {
                        const response = await axios.get(
                            `${authParsed.jiraSubDomain}/rest/api/3/filter/search?filterName=${req.query.filterValue}`,
                            {
                                headers: {
                                    Authorization: `Basic ${authParsed.apiToken}`,
                                },
                            }
                        )

                        res.send(response.data)
                    }

                    if (authParsed.type === OAUTH2) {
                        const response = await axios.get(
                            `https://api.atlassian.com/ex/jira/${authParsed.client_id}/rest/api/3/filter/search?filterName=${req.query.filterValue}`,
                            {
                                headers: {
                                    Authorization: `Bearer ${authParsed.access_token}`,
                                },
                            }
                        )

                        res.send(response.data)
                    }
                } catch (e) {
                    if (e instanceof TypeError) {
                        return errorCallback(e.message)
                    }

                    res.status(e.response.status).send(e.response.data)
                }
            })

            app.get('/filter-details', async (req, res) => {
                try {
                    const authParsed = await getParsedAuth()

                    if (authParsed.type === BASIC_AUTH) {
                        const response = await axios.get(`${authParsed.jiraSubDomain}/rest/api/3/filter/${req.query.id}`, {
                            headers: {
                                Authorization: `Basic ${authParsed.apiToken}`,
                            },
                        })

                        res.send(response.data)
                    }

                    if (authParsed.type === OAUTH2) {
                        const response = await axios.get(
                            `https://api.atlassian.com/ex/jira/${authParsed.client_id}/rest/api/3/filter/${req.query.id}`,
                            {
                                headers: {
                                    Authorization: `Bearer ${authParsed.access_token}`,
                                },
                            }
                        )

                        res.send(response.data)
                    }
                } catch (e) {
                    if (e instanceof TypeError) {
                        return errorCallback(e.message)
                    }

                    res.status(e.response.status).send(e.response.data)
                }
            })

            app.get('/configuration-timetracking', async (req, res) => {
                try {
                    const authParsed = await getParsedAuth()

                    if (authParsed.type === BASIC_AUTH) {
                        const response = await axios.get(`${authParsed.jiraSubDomain}/rest/api/2/configuration/timetracking/options`, {
                            headers: {
                                Authorization: `Basic ${authParsed.apiToken}`,
                            },
                        })

                        res.send(response.data)
                    }

                    if (authParsed.type === OAUTH2) {
                        const response = await axios.get(
                            `https://api.atlassian.com/ex/jira/${authParsed.client_id}/rest/api/2/configuration/timetracking/options`,
                            {
                                headers: {
                                    Authorization: `Bearer ${authParsed.access_token}`,
                                },
                            }
                        )

                        res.send(response.data)
                    }
                } catch (e) {
                    if (e instanceof TypeError) {
                        return errorCallback(e.message)
                    }

                    res.status(e.response.status).send(e.response.data)
                }
            })

            app.post('/filter-details', async (req, res) => {
                try {
                    const authParsed = await getParsedAuth()

                    if (authParsed.type === BASIC_AUTH) {
                        const response = await axios.post(`${authParsed.jiraSubDomain}/rest/api/3/filter`, req.body, {
                            headers: {
                                Authorization: `Basic ${authParsed.apiToken}`,
                            },
                        })

                        res.send(response.data)
                    }

                    if (authParsed.type === OAUTH2) {
                        const response = await axios.post(
                            `https://api.atlassian.com/ex/jira/${authParsed.client_id}/rest/api/3/filter`,
                            req.body,
                            {
                                headers: {
                                    Authorization: `Bearer ${authParsed.access_token}`,
                                },
                            }
                        )

                        res.send(response.data)
                    }
                } catch (e) {
                    if (e instanceof TypeError) {
                        return errorCallback(e.message)
                    }

                    res.status(e.response.status).send(e.response.data)
                }
            })

            app.put('/filter-details', async (req, res) => {
                try {
                    const authParsed = await getParsedAuth()

                    if (authParsed.type === BASIC_AUTH) {
                        const response = await axios.put(`${authParsed.jiraSubDomain}/rest/api/3/filter`, req.body, {
                            headers: {
                                Authorization: `Basic ${authParsed.apiToken}`,
                            },
                        })

                        res.send(response.data)
                    }

                    if (authParsed.type === OAUTH2) {
                        const response = await axios.put(
                            `https://api.atlassian.com/ex/jira/${authParsed.client_id}/rest/api/3/filter`,
                            req.body,
                            {
                                headers: {
                                    Authorization: `Bearer ${authParsed.access_token}`,
                                },
                            }
                        )

                        res.send(response.data)
                    }
                } catch (e) {
                    if (e instanceof TypeError) {
                        return errorCallback(e.message)
                    }

                    res.status(e.response.status).send(e.response.data)
                }
            })

            app.post('/jql-search', async (req, res) => {
                try {
                    const authParsed = await getParsedAuth()

                    if (authParsed.type === BASIC_AUTH) {
                        const response = await axios.post(`${authParsed.jiraSubDomain}${req.query.url}`, req.body, {
                            headers: {
                                Authorization: `Basic ${authParsed.apiToken}`,
                            },
                        })

                        res.send(response.data)
                    }

                    if (authParsed.type === OAUTH2) {
                        const response = await axios.post(
                            `https://api.atlassian.com/ex/jira/${authParsed.client_id}${req.query.url}`,
                            req.body,
                            {
                                headers: {
                                    Authorization: `Bearer ${authParsed.access_token}`,
                                },
                            }
                        )

                        res.send(response.data)
                    }
                } catch (e) {
                    if (e instanceof TypeError) {
                        return errorCallback(e.message)
                    }

                    res.status(e.response.status).send(e.response.data)
                }
            })

            app.get('/jql-search', async (req, res) => {
                try {
                    const authParsed = await getParsedAuth()

                    if (authParsed.type === BASIC_AUTH) {
                        const response = await axios.get(`${authParsed.jiraSubDomain}${req.query.url}`, {
                            headers: {
                                Authorization: `Basic ${authParsed.apiToken}`,
                            },
                        })

                        res.send(response.data)
                    }

                    if (authParsed.type === OAUTH2) {
                        const response = await axios.get(`https://api.atlassian.com/ex/jira/${authParsed.client_id}${req.query.url}`, {
                            headers: {
                                Authorization: `Bearer ${authParsed.access_token}`,
                            },
                        })

                        res.send(response.data)
                    }
                } catch (e) {
                    if (e instanceof TypeError) {
                        return errorCallback(e.message)
                    }

                    res.status(e.response.status).send(e.response.data)
                }
            })

            app.get('/tracking-tasks', async (req, res) => {
                try {
                    const authParsed = await getParsedAuth()

                    if (authParsed.type === BASIC_AUTH) {
                        const response = await axios.get(`${authParsed.jiraSubDomain}/rest/api/2/search`, {
                            headers: {
                                Authorization: `Basic ${authParsed.apiToken}`,
                            },
                            params: req.query,
                        })

                        res.send(response.data)
                    }

                    if (authParsed.type === OAUTH2) {
                        const response = await axios.get(`https://api.atlassian.com/ex/jira/${authParsed.client_id}/rest/api/2/search`, {
                            headers: {
                                Authorization: `Bearer ${authParsed.access_token}`,
                            },
                            params: req.query,
                        })

                        res.send(response.data)
                    }
                } catch (e) {
                    if (e instanceof TypeError) {
                        return errorCallback(e.message)
                    }

                    res.status(e.response.status).send(e.response.data)
                }
            })

            app.get('/worklog-task', async (req, res) => {
                try {
                    const authParsed = await getParsedAuth()

                    if (authParsed.type === BASIC_AUTH) {
                        const response = await axios.get(`${authParsed.jiraSubDomain}/rest/api/3/issue/${req.query.id}/worklog`, {
                            headers: {
                                Authorization: `Basic ${authParsed.apiToken}`,
                            },
                        })

                        res.send(response.data)
                    }

                    if (authParsed.type === OAUTH2) {
                        const response = await axios.get(
                            `https://api.atlassian.com/ex/jira/${authParsed.client_id}/rest/api/3/issue/${req.query.id}/worklog`,
                            {
                                headers: {
                                    Authorization: `Bearer ${authParsed.access_token}`,
                                },
                            }
                        )

                        res.send(response.data)
                    }
                } catch (e) {
                    if (e instanceof TypeError) {
                        return errorCallback(e.message)
                    }

                    res.status(e.response.status).send(e.response.data)
                }
            })

            app.post('/worklog-task', async (req, res) => {
                try {
                    const authParsed = await getParsedAuth()

                    if (authParsed.type === BASIC_AUTH) {
                        const response = await axios.post(
                            `${authParsed.jiraSubDomain}/rest/api/3/issue/${req.body.taskId}/worklog`,
                            {
                                timeSpentSeconds: req.body.timeSpentSeconds,
                            },
                            {
                                headers: {
                                    Authorization: `Basic ${authParsed.apiToken}`,
                                },
                            }
                        )

                        res.send(response.data)
                    }

                    if (authParsed.type === OAUTH2) {
                        const response = await axios.post(
                            `https://api.atlassian.com/ex/jira/${authParsed.client_id}/rest/api/3/issue/${req.body.taskId}/worklog`,
                            {
                                timeSpentSeconds: req.body.timeSpentSeconds,
                            },
                            {
                                headers: {
                                    Authorization: `Bearer ${authParsed.access_token}`,
                                },
                            }
                        )

                        res.send(response.data)
                    }
                } catch (e) {
                    if (e instanceof TypeError) {
                        return errorCallback(e.message)
                    }

                    res.status(e.response.status).send(e.response.data)
                }
            })

            app.put('/worklog-task', async (req, res) => {
                try {
                    const authParsed = await getParsedAuth()

                    if (authParsed.type === BASIC_AUTH) {
                        const response = await axios.put(
                            `${authParsed.jiraSubDomain}/rest/api/3/issue/${req.body.taskId}/worklog/${req.body.id}`,
                            {
                                timeSpentSeconds: req.body.timeSpentSeconds,
                            },
                            {
                                headers: {
                                    Authorization: `Basic ${authParsed.apiToken}`,
                                },
                            }
                        )

                        res.send(response.data)
                    }

                    if (authParsed.type === OAUTH2) {
                        const response = await axios.put(
                            `https://api.atlassian.com/ex/jira/${authParsed.client_id}/rest/api/3/issue/${req.body.taskId}/worklog/${req.body.id}`,
                            {
                                timeSpentSeconds: req.body.timeSpentSeconds,
                            },
                            {
                                headers: {
                                    Authorization: `Bearer ${authParsed.access_token}`,
                                },
                            }
                        )

                        res.send(response.data)
                    }
                } catch (e) {
                    if (e instanceof TypeError) {
                        return errorCallback(e.message)
                    }

                    res.status(e.response.status).send(e.response.data)
                }
            })

            app.post('/change-status-task', async (req, res) => {
                try {
                    const authParsed = await getParsedAuth()

                    if (authParsed.type === BASIC_AUTH) {
                        const response = await axios.post(
                            `${authParsed.jiraSubDomain}/rest/api/2/issue/${req.body.taskId}/transitions`,
                            {
                                transition: {
                                    id: req.body.transitionId,
                                },
                            },
                            {
                                headers: {
                                    Authorization: `Basic ${authParsed.apiToken}`,
                                },
                            }
                        )

                        res.send(response.data)
                    }

                    if (authParsed.type === OAUTH2) {
                        const response = await axios.post(
                            `https://api.atlassian.com/ex/jira/${authParsed.client_id}/rest/api/2/issue/${req.body.taskId}/transitions`,
                            {
                                transition: {
                                    id: req.body.transitionId,
                                },
                            },
                            {
                                headers: {
                                    Authorization: `Bearer ${authParsed.access_token}`,
                                },
                            }
                        )

                        res.send(response.data)
                    }
                } catch (e) {
                    if (e instanceof TypeError) {
                        return errorCallback(e.message)
                    }

                    res.status(e.response.status).send(e.response.data)
                }
            })

            app.listen(port, () => resolve(port))
        } catch (e) {
            errorCallback(e)
        }
    })
}

module.exports = { server }
