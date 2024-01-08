const { app, BrowserWindow, dialog, ipcMain, Notification, powerMonitor } = require('electron')
const path = require('path')
const chokidar = require('chokidar')
const { server } = require('./server')
const portfinder = require('portfinder')

if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'production'
}

const isProd = process.env.NODE_ENV === 'production'

const createWindow = (port) => {
    const mainWindow = new BrowserWindow({
        width: 1920,
        height: 1080,
        icon: path.join(__dirname, 'build', 'icons', '512x512.png'),
        useContentSize: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        },
        ...(isProd && {
            minWidth: 600,
            height: 800,
            width: undefined,
        }),
    })

    ipcMain.on('PORT', (event) => {
        event.returnValue = port
    })

    powerMonitor.on('suspend', () => {
        mainWindow.webContents.send('SUSPEND')
    })

    powerMonitor.on('resume', () => {
        mainWindow.webContents.send('RESUME')
    })

    ipcMain.on('AUTO-START', (event, autoStart) => {
        app.setLoginItemSettings({
            openAtLogin: autoStart,
            path: app.getPath('exe'),
        })
    })

    ipcMain.on('GET-SYSTEM-IDLE-TIME', (event, args) => {
        event.reply('SYSTEM-IDLE-TIME-RESPONSE', powerMonitor.getSystemIdleTime())
    })

    ipcMain.on('NOTIFICATION', (_, { title, body }) => {
        const notification = new Notification({
            title: title,
            body: body,
            icon: path.join(__dirname, 'build', 'icons', '512x512.png'),
        })

        notification.show()

        notification.on('click', () => app.focus())
    })

    mainWindow.on('focus', () => {
        mainWindow.webContents.send('FOCUS')
    })

    mainWindow.on('blur', () => {
        mainWindow.webContents.send('BLUR')
    })

    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.setTitle('Time Tracking')
    })

    if (isProd) {
        mainWindow.loadFile(path.join(__dirname, 'build/index.html'))
    } else {
        const watcher = chokidar.watch(__dirname, { ignored: /node_modules|[\/\\]\./ })

        watcher.on('change', () => {
            mainWindow.reload()
        })

        mainWindow.loadURL(`http://localhost:3000`)
        mainWindow.webContents.openDevTools()
    }
}

app.whenReady()
    .then(() => {
        portfinder.setBasePort(10000)
        return portfinder.getPortPromise()
    })
    .then((port) =>
        server(port, (error) => {
            dialog
                .showMessageBox({
                    type: 'error',
                    title: 'Server error',
                    message: error,
                    buttons: ['Reload'],
                })
                .then(() => {
                    app.quit()
                    app.relaunch()
                })
        })
    )
    .then((port) => {
        createWindow(port)

        app.on('activate', () => {
            if (BrowserWindow.getAllWindows().length === 0) {
                createWindow(port)
            }
        })
    })

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
