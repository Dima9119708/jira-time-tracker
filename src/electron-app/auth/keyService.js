const { safeStorage } = require('electron')

let store

const initStore = () => {
    if (!store) {
        const Store = require('electron-store')

        store = new Store()
    }
}

module.exports = {
    AuthStorage: {
        set: (key, string) => {
            initStore()

            const buffer = safeStorage.encryptString(string)
            store.set(key, buffer.toString('latin1'))
        },
        get: (key) => {
            initStore()

            return safeStorage.decryptString(Buffer.from(store.get(key), 'latin1'))
        },
        delete: (key) => {
            initStore()

            store.delete(key)
        },
        clear: (keys = []) => {
            initStore()

            keys.forEach((key) => {
                store.delete(key)
            })
        },
    },
}
