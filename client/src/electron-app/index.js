const { app, BrowserWindow } = require('electron')

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1920,
        height: 1080,
    })

    // and load the index.html of the app.
    // win.loadURL(`http://localhost:3000`)

    win.loadURL(`file://${__dirname}/../../build/index.html`)

    // Open the DevTools.
    win.webContents.openDevTools()
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})