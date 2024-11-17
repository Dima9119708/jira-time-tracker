const { ipcMain } = require('electron')
const { AUTH_PLUGIN_DATA } = require('../constans')
const { AuthStorage } = require('./keyService')

const controllerAuthPlugin = () => {
    ipcMain.handle('DELETE_AUTH_PLUGIN_DATA', () => {
        AuthStorage.delete(AUTH_PLUGIN_DATA)
    })
    ipcMain.handle('GET_AUTH_PLUGIN_DATA', () => {
        try {
            const authData = AuthStorage.get(AUTH_PLUGIN_DATA)
            return JSON.parse(authData)
        } catch (e) {
            return {}
        }
    })
}

module.exports = controllerAuthPlugin
