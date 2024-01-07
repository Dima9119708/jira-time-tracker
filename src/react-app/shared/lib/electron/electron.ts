let instanceElectron: typeof Electron.CrossProcessExports

type Callback = (methods: typeof Electron.CrossProcessExports) => void

export const electron = (callback: Callback) => {
    if (window.require) {
        if (instanceElectron) {
            return callback(instanceElectron)
        }

        instanceElectron = window.require('electron')

        callback(instanceElectron)
    }
}
