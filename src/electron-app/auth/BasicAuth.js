const { ipcMain } = require('electron')
const keytar = require('keytar')
const { NAME_PROJECT, AUTH_DATA, BASIC_AUTH } = require('../constans')

const basicAuth = () => {
    ipcMain.handle('POST_BASIC_AUTH', async (event, { apiToken, jiraSubDomain }) => {
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
}

module.exports = basicAuth
