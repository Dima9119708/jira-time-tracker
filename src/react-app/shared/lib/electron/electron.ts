let instanceElectron: typeof Electron.CrossProcessExports

type Callback<ReturnValue> = (methods: typeof Electron.CrossProcessExports) => ReturnValue

export const electron = <ReturnValue>(callback: Callback<ReturnValue>) => {
    if (instanceElectron) {
        return callback(instanceElectron)
    }

    instanceElectron = window.require('electron')

    return callback(instanceElectron)
}
