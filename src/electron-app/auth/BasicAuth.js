const { ipcMain } = require('electron')
const { AUTH_DATA, BASIC_AUTH, AUTH_REMEMBER_DATA } = require('../constans')
const { AuthStorage } = require('./keyService')

const basicAuth = () => {
    ipcMain.handle('SAVE_DATA_BASIC_AUTH', (event, { apiToken, jiraSubDomain }) => {
        AuthStorage.set(
            AUTH_DATA,
            JSON.stringify({
                apiToken: apiToken,
                jiraSubDomain: jiraSubDomain,
                type: BASIC_AUTH,
            })
        )
    })

    ipcMain.handle('GET_REMEMBER_DATA_BASIC_AUTH', async () => {
        try {
            const authRememberData = AuthStorage.get(AUTH_REMEMBER_DATA)
            return JSON.parse(authRememberData)
        } catch (e) {
            return null
        }
    })

    ipcMain.handle('SAVE_REMEMBER_DATA_BASIC_AUTH', async (_, authRememberData) => {
        AuthStorage.set(AUTH_REMEMBER_DATA, JSON.stringify(authRememberData))
    })

    ipcMain.handle('DELETE_REMEMBER_DATA_BASIC_AUTH', async () => {
        AuthStorage.delete(AUTH_REMEMBER_DATA)
    })
}

module.exports = basicAuth
