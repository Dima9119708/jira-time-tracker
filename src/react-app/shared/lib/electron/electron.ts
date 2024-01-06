let instanceElectron: typeof Electron.CrossProcessExports

export const electron = (callback: (methods: typeof Electron.CrossProcessExports) => void) => {
    if (window.require) {
        if (instanceElectron) {
            return callback(instanceElectron)
        }

        instanceElectron = window.require('electron')

        callback(instanceElectron)
    }
}
