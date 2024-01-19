const { BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const url = require('url')
const axios = require('axios')
const keytar = require('keytar')
const { NAME_PROJECT, AUTH_DATA, OAUTH2, BASIC_AUTH } = require('../constans')

const OAuth2Window = (mainWindow) => {
    ipcMain.on('OPEN_OAuth2', () => {
        const oAuthWindow = new BrowserWindow({
            width: 1200,
            height: 800,
            icon: path.join(__dirname, 'build', 'icons', '512x512.png'),
            useContentSize: true,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
            },
            alwaysOnTop: true,
        })

        oAuthWindow.loadURL(
            `https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=${process.env.CLIENT_ID}&scope=offline_access%20read%3Ajira-user%20read%3Afilter%3Ajira%20read%3Aissue.time-tracking%3Ajira%20read%3Auser-configuration%3Ajira%20write%3Afilter%3Ajira%20read%3Afilter.column%3Ajira%20delete%3Afilter%3Ajira%20read%3Agroup%3Ajira%20read%3Aproject%3Ajira%20read%3Aproject-role%3Ajira%20read%3Auser%3Ajira%20read%3Ajql%3Ajira%20read%3Aapplication-role%3Ajira%20read%3Aavatar%3Ajira%20read%3Aissue-type-hierarchy%3Ajira&redirect_uri=http%3A%2F%2Flocalhost%2Fcallbacks&state=${'YOUR_USER_BOUND_VALUE'}&response_type=code&prompt=consent`
        )

        oAuthWindow.webContents.session.webRequest.onBeforeRequest(
            {
                urls: ['http://localhost/callbacks*'],
            },
            async (res) => {
                const parsedURL = url.parse(res.url, true)

                try {
                    const response = await axios.post('https://auth.atlassian.com/oauth/token', {
                        grant_type: 'authorization_code',
                        client_id: process.env.CLIENT_ID,
                        client_secret: process.env.CLIENT_SECRET,
                        code: parsedURL.query.code,
                        redirect_uri: 'http://localhost/callbacks',
                    })

                    const responseAccessibleResources = await axios.get('https://api.atlassian.com/oauth/token/accessible-resources', {
                        headers: {
                            Authorization: `Bearer ${response.data.access_token}`,
                        },
                    })

                    const client_id = responseAccessibleResources.data[0].id

                    await keytar.setPassword(
                        NAME_PROJECT,
                        AUTH_DATA,
                        JSON.stringify({
                            access_token: response.data.access_token,
                            refresh_token: response.data.refresh_token,
                            client_id,
                            type: OAUTH2,
                        })
                    )

                    mainWindow.webContents.send('REFETCH_LOGIN')

                    oAuthWindow.destroy()
                } catch (e) {
                    oAuthWindow.destroy()
                }
            }
        )
    })
}

module.exports = OAuth2Window
