export const electron = (callback: (methods: typeof Electron.CrossProcessExports) => void) => {
    if (window.require) {
        callback(window.require('electron'))
    }
}
