const { ipcMain } = require('electron')
const keytar = require('keytar')
const { NAME_PROJECT, AUTH_DATA, BASIC_AUTH, AUTH_REMEMBER_DATA } = require('../constans')

const basicAuth = () => {
    ipcMain.handle('SAVE_DATA_BASIC_AUTH', async (event, { apiToken, jiraSubDomain }) => {
        await keytar.setPassword(
            NAME_PROJECT,
            AUTH_DATA,
            JSON.stringify({
                apiToken: apiToken,
                jiraSubDomain: jiraSubDomain,
                type: BASIC_AUTH,
            })
        )
    })

    ipcMain.handle('GET_REMEMBER_DATA_BASIC_AUTH', async () => {
        const authRememberData = await keytar.getPassword(NAME_PROJECT, AUTH_REMEMBER_DATA)

        try {
            return JSON.parse(authRememberData)
        } catch (e) {
            return null
        }
    })

    ipcMain.handle('SAVE_REMEMBER_DATA_BASIC_AUTH', async (_, authRememberData) => {
        await keytar.setPassword(NAME_PROJECT, AUTH_REMEMBER_DATA, JSON.stringify(authRememberData))
    })

    ipcMain.handle('DELETE_REMEMBER_DATA_BASIC_AUTH', async () => {
        await keytar.deletePassword(NAME_PROJECT, AUTH_REMEMBER_DATA)
    })
}

module.exports = basicAuth
