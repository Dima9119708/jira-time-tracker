const { BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const url = require('url')
const keytar = require('keytar')
const { NAME_PROJECT, AUTH_DATA, OAUTH2 } = require('../../constans')
const atlassianURL = require('./createAtlassianURL')

const OAuth2Window = (mainWindow) => {
    ipcMain.handle('SAVE_DATA_OAuth2', async (event, { access_token, refresh_token, client_id }) => {
        await keytar.setPassword(
            NAME_PROJECT,
            AUTH_DATA,
            JSON.stringify({
                access_token: access_token,
                refresh_token: refresh_token,
                client_id,
                type: OAUTH2,
            })
        )

        return true
    })

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

        oAuthWindow.loadURL(atlassianURL.toString())

        oAuthWindow.webContents.session.webRequest.onBeforeRequest(
            {
                urls: [`${process.env.REDIRECT_URL}*`],
            },
            async (res) => {
                const parsedURL = url.parse(res.url, true)

                if (parsedURL.query.code) {
                    mainWindow.webContents.send('ACCEPT_OAuth2', parsedURL.query.code)
                }

                oAuthWindow.destroy()
            }
        )
    })
}

module.exports = OAuth2Window
