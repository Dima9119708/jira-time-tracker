const express = require('express')
const cors = require('cors')
const axios = require('axios')
const { AUTH_DATA, BASIC_AUTH, OAUTH2, PLUGINS, AUTH_PLUGIN_DATA } = require('./constans')
const { AuthStorage } = require('./auth/keyService')

const getParsedAuth = async () => {
    try {
        const authData = AuthStorage.get(AUTH_DATA)
        return JSON.parse(authData)
    } catch (e) {
        throw new TypeError('The authorization credentials are corrupted')
    }
}

const getParsedAuthPlugin = async () => {
    try {
        const authData = AuthStorage.get(AUTH_PLUGIN_DATA)
        return JSON.parse(authData)
    } catch (e) {
        return {}
    }
}

const server = (port, errorCallback) => {
    return new Promise((resolve) => {
        try {
            const app = express()

            app.use(cors())

            app.use(express.json())

            app.get('/myself', async (req, res) => {
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

                    res.status(401).send()
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

            app.get('/issues', async (req, res) => {
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
                            `https://api.atlassian.com/ex/jira/${authParsed.client_id}/rest/api/3/issue/${req.query.id}/assignee`,
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

            app.get('/filter/search', async (req, res) => {
                try {
                    const authParsed = await getParsedAuth()

                    if (authParsed.type === BASIC_AUTH) {
                        const response = await axios.get(`${authParsed.jiraSubDomain}/rest/api/3/filter/search`, {
                            headers: {
                                Authorization: `Basic ${authParsed.apiToken}`,
                            },
                            params: req.query,
                        })

                        res.send(response.data)
                    }

                    if (authParsed.type === OAUTH2) {
                        const response = await axios.get(
                            `https://api.atlassian.com/ex/jira/${authParsed.client_id}/rest/api/3/filter/search`,
                            {
                                headers: {
                                    Authorization: `Bearer ${authParsed.access_token}`,
                                },
                                params: req.query,
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

            app.get('/user/search', async (req, res) => {
                try {
                    const authParsed = await getParsedAuth()

                    if (authParsed.type === BASIC_AUTH) {
                        const response = await axios.get(`${authParsed.jiraSubDomain}/rest/api/3/user/search`, {
                            headers: {
                                Authorization: `Basic ${authParsed.apiToken}`,
                            },
                            params: req.query,
                        })

                        res.send(response.data)
                    }

                    if (authParsed.type === OAUTH2) {
                        const response = await axios.get(
                            `https://api.atlassian.com/ex/jira/${authParsed.client_id}/rest/api/3/user/search`,
                            {
                                headers: {
                                    Authorization: `Bearer ${authParsed.access_token}`,
                                },
                                params: req.query,
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

            app.get('/priorityscheme', async (req, res) => {
                try {
                    const authParsed = await getParsedAuth()

                    if (authParsed.type === BASIC_AUTH) {
                        const response = await axios.get(`${authParsed.jiraSubDomain}/rest/api/3/priorityscheme`, {
                            headers: {
                                Authorization: `Basic ${authParsed.apiToken}`,
                            },
                            params: req.query,
                        })

                        res.send(response.data)
                    }

                    if (authParsed.type === OAUTH2) {
                        const response = await axios.get(
                            `https://api.atlassian.com/ex/jira/${authParsed.client_id}/rest/api/3/priorityscheme`,
                            {
                                headers: {
                                    Authorization: `Bearer ${authParsed.access_token}`,
                                },
                                params: req.query,
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

            app.get('/user/assignable/multiProjectSearch', async (req, res) => {
                try {
                    const authParsed = await getParsedAuth()

                    if (authParsed.type === BASIC_AUTH) {
                        const response = await axios.get(`${authParsed.jiraSubDomain}/rest/api/3/user/assignable/multiProjectSearch`, {
                            headers: {
                                Authorization: `Basic ${authParsed.apiToken}`,
                            },
                            params: req.query,
                        })

                        res.send(response.data)
                    }

                    if (authParsed.type === OAUTH2) {
                        const response = await axios.get(
                            `https://api.atlassian.com/ex/jira/${authParsed.client_id}/rest/api/3/user/assignable/multiProjectSearch`,
                            {
                                headers: {
                                    Authorization: `Bearer ${authParsed.access_token}`,
                                },
                                params: req.query,
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

            app.post('/filter', async (req, res) => {
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

            app.put('/filter', async (req, res) => {
                try {
                    const authParsed = await getParsedAuth()

                    if (authParsed.type === BASIC_AUTH) {
                        const response = await axios.put(`${authParsed.jiraSubDomain}/rest/api/3/filter/${req.query.id}`, req.body, {
                            headers: {
                                Authorization: `Basic ${authParsed.apiToken}`,
                            },
                        })

                        res.send(response.data)
                    }

                    if (authParsed.type === OAUTH2) {
                        const response = await axios.put(
                            `https://api.atlassian.com/ex/jira/${authParsed.client_id}/rest/api/3/filter/${req.query.id}`,
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

            app.get('/statuses', async (req, res) => {
                try {
                    const authParsed = await getParsedAuth()

                    if (authParsed.type === BASIC_AUTH) {
                        const response = await axios.get(`${authParsed.jiraSubDomain}/rest/api/3/statuses/search`, {
                            headers: {
                                Authorization: `Basic ${authParsed.apiToken}`,
                            },
                            params: req.query,
                        })

                        res.send(response.data)
                    }

                    if (authParsed.type === OAUTH2) {
                        const response = await axios.get(
                            `https://api.atlassian.com/ex/jira/${authParsed.client_id}/rest/api/3/statuses/search`,
                            {
                                headers: {
                                    Authorization: `Bearer ${authParsed.access_token}`,
                                },
                                params: req.query,
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

            app.get('/projects', async (req, res) => {
                try {
                    const authParsed = await getParsedAuth()

                    if (authParsed.type === BASIC_AUTH) {
                        const response = await axios.get(`${authParsed.jiraSubDomain}/rest/api/3/project/search`, {
                            headers: {
                                Authorization: `Basic ${authParsed.apiToken}`,
                            },
                            params: req.query,
                        })

                        res.send(response.data)
                    }

                    if (authParsed.type === OAUTH2) {
                        const response = await axios.get(
                            `https://api.atlassian.com/ex/jira/${authParsed.client_id}/rest/api/3/project/search`,
                            {
                                headers: {
                                    Authorization: `Bearer ${authParsed.access_token}`,
                                },
                                params: req.query,
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

            app.get('/issue-worklogs', async (req, res) => {
                try {
                    const authParsed = await getParsedAuth()

                    if (authParsed.type === BASIC_AUTH) {
                        const response = await axios.get(`${authParsed.jiraSubDomain}/rest/api/3/issue/${req.query.issueId}/worklog`, {
                            headers: {
                                Authorization: `Basic ${authParsed.apiToken}`,
                            },
                            params: req.query,
                        })

                        res.send(response.data)
                    }

                    if (authParsed.type === OAUTH2) {
                        const response = await axios.get(
                            `https://api.atlassian.com/ex/jira/${authParsed.client_id}/rest/api/3/issue/${req.query.issueId}/worklog`,
                            {
                                headers: {
                                    Authorization: `Bearer ${authParsed.access_token}`,
                                },
                                params: req.query,
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

            app.post('/worklogs/plugin', async (req, res) => {
                try {
                    const authParsed = await getParsedAuthPlugin()

                    if (authParsed.namePlugin === PLUGINS.TEMPO) {
                        const response = await axios.post(`https://api.tempo.io/4/worklogs/search`, req.body, {
                            headers: {
                                Authorization: `Bearer ${authParsed.access_token}`,
                            },
                        })

                        res.send(response.data)
                    }

                    res.status(401).send()
                } catch (e) {
                    if (e instanceof TypeError) {
                        return errorCallback(e.message)
                    }

                    res.status(e.response.status).send(e.response.data)
                }
            })

            app.post('/worklogs', async (req, res) => {
                try {
                    const authParsed = await getParsedAuth()

                    if (authParsed.type === BASIC_AUTH) {
                        const response = await axios.post(`${authParsed.jiraSubDomain}/rest/api/3/search`, req.body, {
                            headers: {
                                Authorization: `Basic ${authParsed.apiToken}`,
                            },
                        })

                        res.send(response.data)
                    }

                    if (authParsed.type === OAUTH2) {
                        const response = await axios.post(
                            `https://api.atlassian.com/ex/jira/${authParsed.client_id}/rest/api/3/search`,
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

            app.post('/issue-worklog', async (req, res) => {
                try {
                    const authParsed = await getParsedAuth()

                    if (authParsed.type === BASIC_AUTH) {
                        const response = await axios.post(
                            `${authParsed.jiraSubDomain}/rest/api/3/issue/${req.body.issueId}/worklog`,
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
                        const response = await axios.post(
                            `https://api.atlassian.com/ex/jira/${authParsed.client_id}/rest/api/3/issue/${req.body.issueId}/worklog`,
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

            app.post('/issue-worklog/plugin', async (req, res) => {
                try {
                    const authParsed = await getParsedAuthPlugin()

                    switch (authParsed.namePlugin) {
                        case PLUGINS.TEMPO: {
                            const response = await axios.post('https://api.tempo.io/4/worklogs', req.body, {
                                headers: {
                                    Authorization: `Bearer ${authParsed.access_token}`,
                                },
                            })

                            res.send(response.data)

                            break
                        }

                        default: {
                            res.status(401).send()
                        }
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
                            `https://api.atlassian.com/ex/jira/${authParsed.client_id}/rest/api/3/issue/${req.body.taskId}/worklog/${req.body.id}`,
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

            app.put('/issue-worklog', async (req, res) => {
                try {
                    const authParsed = await getParsedAuth()

                    if (authParsed.type === BASIC_AUTH) {
                        const response = await axios.put(
                            `${authParsed.jiraSubDomain}/rest/api/3/issue/${req.body.issueId}/worklog/${req.body.id}`,
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
                            `https://api.atlassian.com/ex/jira/${authParsed.client_id}/rest/api/3/issue/${req.body.issueId}/worklog/${req.body.id}`,
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

            app.put('/issue-worklog/plugin', async (req, res) => {
                try {
                    const authParsed = await getParsedAuthPlugin()

                    switch (authParsed.namePlugin) {
                        case PLUGINS.TEMPO: {
                            const response = await axios.put(`https://api.tempo.io/4/worklogs/${req.body.id}`, req.body, {
                                headers: {
                                    Authorization: `Bearer ${authParsed.access_token}`,
                                },
                            })

                            res.send(response.data)

                            break
                        }

                        default: {
                            res.status(401).send()
                        }
                    }
                } catch (e) {
                    if (e instanceof TypeError) {
                        return errorCallback(e.message)
                    }

                    res.status(e.response.status).send(e.response.data)
                }
            })

            app.delete('/issue-worklog', async (req, res) => {
                try {
                    const authParsed = await getParsedAuth()

                    if (authParsed.type === BASIC_AUTH) {
                        const response = await axios.delete(
                            `${authParsed.jiraSubDomain}/rest/api/3/issue/${req.query.issueId}/worklog/${req.query.id}`,
                            {
                                headers: {
                                    Authorization: `Basic ${authParsed.apiToken}`,
                                },
                            }
                        )

                        res.send(response.data)
                    }

                    if (authParsed.type === OAUTH2) {
                        const response = await axios.delete(
                            `https://api.atlassian.com/ex/jira/${authParsed.client_id}/rest/api/3/issue/${req.query.issueId}/worklog/${req.query.id}`,
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

            app.delete('/issue-worklog/plugin', async (req, res) => {
                try {
                    const authParsed = await getParsedAuthPlugin()

                    switch (authParsed.namePlugin) {
                        case PLUGINS.TEMPO: {
                            const response = await axios.delete(`https://api.tempo.io/4/worklogs/${req.query.id}`, {
                                headers: {
                                    Authorization: `Bearer ${authParsed.access_token}`,
                                },
                            })

                            res.send(response.data)

                            break
                        }

                        default: {
                            res.status(401).send()
                        }
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

            app.post('/refresh-token', async (req, res) => {
                try {
                    const authParsed = await getParsedAuth()

                    const response = await axios.post(`https://auth.atlassian.com/oauth/token`, {
                        grant_type: 'refresh_token',
                        client_id: process.env.CLIENT_ID,
                        client_secret: process.env.CLIENT_SECRET,
                        refresh_token: authParsed.refresh_token,
                    })

                    AuthStorage.set(
                        AUTH_DATA,
                        JSON.stringify({
                            ...AuthStorage.get(AUTH_DATA),
                            access_token: response.data.access_token,
                            refresh_token: response.data.refresh_token,
                            client_id: authParsed.client_id,
                            type: OAUTH2,
                        })
                    )

                    res.send(response.data)
                } catch (e) {
                    if (e instanceof TypeError) {
                        return errorCallback(e.message)
                    }

                    res.status(e.response.status).send(e.response.data)
                }
            })

            app.post('/refresh-token/plugin', async (req, res) => {
                try {
                    const authParsed = await getParsedAuthPlugin()

                    if (authParsed.namePlugin === PLUGINS.TEMPO) {
                        if (authParsed.type === OAUTH2) {
                            const response = await axios.post(`https://api.tempo.io/oauth/token/`, {
                                grant_type: 'refresh_token',
                                client_id: authParsed.client_id,
                                redirect_uri: process.env.REDIRECT_URL,
                                client_secret: authParsed.client_secret,
                                refresh_token: authParsed.refresh_token,
                            })

                            AuthStorage.set(
                                AUTH_PLUGIN_DATA,
                                JSON.stringify({
                                    ...AuthStorage.get(AUTH_PLUGIN_DATA),
                                    access_token: response.data.access_token,
                                    refresh_token: response.data.refresh_token,
                                    client_id: authParsed.client_id,
                                    type: OAUTH2,
                                })
                            )

                            res.send(response.data)
                        }
                    }

                    res.status(401).send()
                } catch (e) {
                    if (e instanceof TypeError) {
                        return errorCallback(e.message)
                    }

                    res.status(e.response.status).send(e.response.data)
                }
            })

            app.post('/oauth-token', async (req, res) => {
                try {
                    const response = await axios.post(`https://auth.atlassian.com/oauth/token`, {
                        grant_type: 'authorization_code',
                        client_id: process.env.CLIENT_ID,
                        client_secret: process.env.CLIENT_SECRET,
                        code: req.body.code,
                        redirect_uri: process.env.REDIRECT_URL,
                    })

                    res.send(response.data)
                } catch (e) {
                    if (e instanceof TypeError) {
                        return errorCallback(e.message)
                    }

                    res.status(e.response.status).send(e.response.data)
                }
            })

            app.post('/oauth-token-plugin', async (req, res) => {
                try {
                    const response = await axios.post(`https://auth.atlassian.com/oauth/token`, {
                        grant_type: 'authorization_code',
                        client_id: req.body.client_id,
                        client_secret: req.body.client_secret,
                        code: req.body.code,
                        redirect_uri: process.env.REDIRECT_URL,
                    })

                    res.send(response.data)
                } catch (e) {
                    if (e instanceof TypeError) {
                        return errorCallback(e.message)
                    }

                    res.status(e.response.status).send(e.response.data)
                }
            })

            app.get('/oauth-token-accessible-resources', async (req, res) => {
                try {
                    const response = await axios.get('https://api.atlassian.com/oauth/token/accessible-resources', {
                        headers: {
                            Authorization: `Bearer ${req.headers.access_token}`,
                        },
                    })

                    res.send(response.data)
                } catch (e) {
                    if (e instanceof TypeError) {
                        return errorCallback(e.message)
                    }

                    res.status(e.response.status).send(e.response.data)
                }
            })

            app.get('/check-connection-plugin', async (req, res) => {
                try {
                    switch (req.query.namePlugin) {
                        case PLUGINS.TEMPO: {
                            await axios.get('https://api.tempo.io/4/worklogs', {
                                headers: {
                                    Authorization: `Bearer ${req.query.access_token}`,
                                },
                            })

                            res.send(200)

                            break
                        }

                        default: {
                            res.status(500).send({ message: 'Plugin not found' })
                        }
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
