const { BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const { AUTH_PLUGIN_DATA, OAUTH2 } = require('../../constans')
const { AuthStorage } = require('../keyService')

const AuthWindowPlugin = (mainWindow) => {
    ipcMain.handle('SAVE_AUTH_DATA_PLUGIN', async (event, { access_token, refresh_token, client_id, client_secret, namePlugin }) => {
        return AuthStorage.set(
            AUTH_PLUGIN_DATA,
            JSON.stringify({
                access_token: access_token,
                refresh_token: refresh_token,
                client_id,
                client_secret,
                type: (access_token && refresh_token && OAUTH2) || null,
                namePlugin: namePlugin,
            })
        )
    })

    ipcMain.on('OPEN_OAuth2Plugin', (event, { url, redirect_url }) => {
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

        oAuthWindow.loadURL(url)

        oAuthWindow.webContents.session.webRequest.onBeforeRequest(
            {
                urls: [`${process.env.REDIRECT_URL}*`],
            },
            async (res) => {
                const parsedURL = url.parse(res.url, true)

                if (parsedURL.query.code) {
                    mainWindow.webContents.send('ACCEPT_OAuth2Plugin', parsedURL.query.code)
                }

                oAuthWindow.destroy()
            }
        )
    })
}

module.exports = AuthWindowPlugin
