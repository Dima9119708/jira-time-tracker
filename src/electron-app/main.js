const { app, BrowserWindow, Notification } = require('electron')
const path = require('path')
const chokidar = require('chokidar')
const server = require('./server')

if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'production'
}

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1920,
        minWidth: 600,
        icon: path.join(__dirname, 'clock-play.png'),
        height: 1080,
        useContentSize: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        },
    })

    if (process.env.NODE_ENV === 'production') {
        win.loadFile(path.join(__dirname, 'build/index.html'))
    } else {
        const watcher = chokidar.watch(__dirname, { ignored: /node_modules|[\/\\]\./ })

        watcher.on('change', () => win.reload())

        win.loadURL(`http://localhost:3000`)
        win.webContents.openDevTools()
    }
}

app.whenReady().then(() => {
    server(
        () => {
            createWindow()

            app.on('activate', () => {
                if (BrowserWindow.getAllWindows().length === 0) {
                    createWindow()
                }
            })
        },
        (error) => {
            const notification = new Notification({
                title: 'Server error',
                body: error,
            })

            notification.on('click', () => {
                app.quit()
                app.relaunch()
            })

            notification.show()
        }
    )
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
