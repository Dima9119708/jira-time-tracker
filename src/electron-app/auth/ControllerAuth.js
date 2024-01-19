const { ipcMain } = require('electron')
const keytar = require('keytar')
const { NAME_PROJECT, AUTH_DATA } = require('../constans')

const controllerAuth = () => {
    ipcMain.handle('DELETE_AUTH_DATA', async () => {
        await keytar.deletePassword(NAME_PROJECT, AUTH_DATA)
        return true
    })
    ipcMain.handle('GET_AUTH_DATA', async () => {
        return await keytar.getPassword(NAME_PROJECT, AUTH_DATA)
    })
}

module.exports = controllerAuth
