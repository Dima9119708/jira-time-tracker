const { ipcMain } = require('electron')
const { AUTH_DATA } = require('../constans')
const { AuthStorage } = require('./keyService')

const controllerAuth = () => {
    ipcMain.handle('DELETE_AUTH_DATA', () => {
        AuthStorage.delete(AUTH_DATA)
    })
    ipcMain.handle('GET_AUTH_DATA', async () => {
        try {
            const authData = AuthStorage.get(AUTH_DATA)
            return JSON.parse(authData)
        } catch (e) {
            return ''
        }
    })
}

module.exports = controllerAuth
