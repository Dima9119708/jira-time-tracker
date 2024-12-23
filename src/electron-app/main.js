/*
* TODO:
    1. Refactor all JavaScript code to TypeScript.
    2. Split the code into separate files/modules for better maintainability and modularity.
* */
const { app, BrowserWindow, dialog, ipcMain, Notification, powerMonitor, session, Tray, Menu } = require('electron')
const path = require('path')
const portfinder = require('portfinder')
const url = require('url')
const os = require('os');
const { autoUpdater } = require('electron-updater');

const OAuth2Window = require('./auth/oAuth2/OAuth2')
const BasicAuth = require('./auth/BasicAuth')
const ControllerAuth = require('./auth/ControllerAuth')
const ControllerAuthPlugin = require('./auth/ControllerAuthPlugin')
const { server } = require('./server')
const { AUTH_DATA } = require('./constans')
const { AuthStorage, ThemeStorage, ZoomStorage } = require('./auth/keyService')
const AuthWindowPlugin = require('./auth/AuthPlugin/AuthPlugin')

const isProd = process.env.NODE_ENV === 'production'
const isDev = process.env.NODE_ENV === 'development'

const LogoPath = path.join(__dirname, '..', 'logos', '512x512.png')
const HTMLPath = path.join(__dirname, '..', 'react-app', 'index.html')

const createChangePort = () => {
    return new Promise((resolve) => {
        const mainWindow = new BrowserWindow({
            width: 1200,
            height: 800,
            icon: LogoPath,
            useContentSize: true,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
            },
            ...(isProd && {
                width: 400,
                height: 500,
                resizable: false,
            }),
        })

        ipcMain.on('CHANGE-PORT-OK', async (event, newPort) => {
            try {
                mainWindow.webContents.send('CHANGE-PORT-LOADING', true)

                const _newPort = +newPort

                const tcpPortUsed = require('tcp-port-used')
                const { killPortProcess } = require('kill-port-process')

                const inUse = await tcpPortUsed.check(_newPort)
                if (inUse) {
                    await killPortProcess(_newPort)
                    await tcpPortUsed.waitUntilFree(_newPort)
                }

                mainWindow.webContents.send('CHANGE-PORT-LOADING', false)

                resolve(newPort)

                mainWindow.close()
            } catch (e) {
                mainWindow.webContents.send('CHANGE-PORT-LOADING', false)

                mainWindow.webContents.send('CHANGE-PORT-ERROR', e.message)
            }
        })

        ipcMain.on('CHANGE-PORT-CANCEL', () => {
            mainWindow.close()
            app.quit()
        })

        mainWindow.webContents.on('did-finish-load', () => {
            mainWindow.setTitle('Time Tracking')
        })

        if (isProd) {
            mainWindow.webContents.loadURL(
                url.format({
                    pathname: HTMLPath,
                    hash: '/component-change-port',
                    protocol: 'file',
                })
            )
        } else {
            mainWindow.loadURL(`http://localhost:3000/component-change-port`)
            mainWindow.webContents.openDevTools()
        }
    })
}

const createMainWindow = (port) => {
    const mainWindow = new BrowserWindow({
        width: 1920,
        height: 1080,
        title: 'Time Tracking',
        icon: LogoPath,
        useContentSize: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        },
        resizable: true,
        ...(isProd && {
            minWidth: 600,
            height: 800,
            width: undefined,
        }),
    })

    ipcMain.on('PORT', (event) => {
        event.returnValue = port
    })

    ipcMain.on('GET_ZOOM', (event) => {
        event.returnValue = ZoomStorage.get()
    })

    ipcMain.on('SET_ZOOM', (event, zoom) => {
        ZoomStorage.set(zoom)
        mainWindow.webContents.setZoomFactor(zoom)
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

    ipcMain.on('SET_THEME', (event, theme) => {
        ThemeStorage.set(theme)
    })

    ipcMain.on('GET_THEME', (event) => {
        event.returnValue = ThemeStorage.get()
    })

    ipcMain.on('GET-SYSTEM-IDLE-TIME', (event, args) => {
        event.reply('SYSTEM-IDLE-TIME-RESPONSE', powerMonitor.getSystemIdleTime())
    })

    ipcMain.on('NOTIFICATION', (_, { title, body }) => {
        const notification = new Notification({
            title: title,
            body: body,
            icon: LogoPath,
        })

        notification.show()

        notification.on('click', () => app.focus())
    })

    mainWindow.on('focus', () => {
        mainWindow.webContents.send('FOCUS')
    })

    ipcMain.on('IS_FOCUSED', (event) => {
        event.returnValue = mainWindow.isFocused()
    })

    mainWindow.on('blur', () => {
        mainWindow.webContents.send('BLUR')
    })

    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.setTitle('Time Tracking')
    })

    if (isProd) {
        mainWindow.loadFile(HTMLPath)
    } else {
        mainWindow.loadURL(`http://localhost:3000`)
        mainWindow.webContents.openDevTools()
    }

    let tray

    if (isProd) {
        tray = new Tray(LogoPath);

        const contextMenu = Menu.buildFromTemplate([
            {
                label: 'Open',
                click: () => {
                    mainWindow.show();
                }
            },
            {
                label: 'Quit',
                click: () => {
                    app.quit();
                }
            }
        ]);

        tray.setToolTip('Time Tracking');
        tray.setContextMenu(contextMenu);

        tray.on('right-click', () => {
            tray.popUpContextMenu(contextMenu);
        });

        tray.on('click', () => {
            if (mainWindow.isMinimized()) mainWindow.restore();
            if (!mainWindow.isVisible()) mainWindow.show();
            mainWindow.focus();
        });

        mainWindow.on('close', (event) => {
            if (!mainWindow.isVisible()) {
                return;
            }
            event.preventDefault();
            mainWindow.hide();
        });

    }

    return { mainWindow, tray }
}

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
    app.quit();
} else {
    app.whenReady().then(async () => {
        if (isDev) {
            try {
                const reduxDevToolsPath = path.join(
                    os.homedir(),
                    '.config/google-chrome/Default/Extensions/lmhkpmbekcpmknklioeibfkpmmfibljd/3.2.7_0'
                );

                const reactDevToolsPath = path.join(
                    os.homedir(),
                    '.config/google-chrome/Default/Extensions/gphhapmejobijbbhgpjhcjognlahblep/12_0'
                );

                await session.defaultSession.loadExtension(reduxDevToolsPath);
                await session.defaultSession.loadExtension(reactDevToolsPath);
            } catch (e) {
                console.error(e);
            }
        }
    })
        .then(async () => {
            try {
                portfinder.setBasePort(10000)
                return await portfinder.getPortPromise()
            } catch (e) {
                return createChangePort()
            }
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
                        AuthStorage.clear([AUTH_DATA])
                        app.quit()
                        app.relaunch()
                    })
            })
        )
        .then((port) => {
            autoUpdater.autoInstallOnAppQuit = true;

            const { mainWindow, tray } = createMainWindow(port)

            ControllerAuth()
            ControllerAuthPlugin()
            OAuth2Window(mainWindow)
            AuthWindowPlugin(mainWindow)
            BasicAuth()

            const currentMenu = Menu.getApplicationMenu();

            const onUpdateNotAvailable = () => {
                dialog.showMessageBox(mainWindow,{
                    type: 'info',
                    title: 'No Updates',
                    message: 'No updates are available at the moment.',
                }).then(() => {})
                    .catch(() => {});

            }

            const updateMenuItem = {
                label: 'Check for updates and download them',
                click: () => {
                    autoUpdater.checkForUpdates();
                    autoUpdater.once('update-not-available', onUpdateNotAvailable);
                },
            };

            const updatedMenu = Menu.buildFromTemplate([
                ...(currentMenu ? currentMenu.items.map((item) => item) : []),
                {
                    label: 'Updates',
                    submenu: [updateMenuItem],
                },
            ]);

            Menu.setApplicationMenu(updatedMenu);

            autoUpdater.on('update-available', () => {
                dialog.showMessageBox(mainWindow, {
                    type: 'info',
                    title: 'Update Available',
                    message: 'A new version of the application is available. It will be downloaded in the background.',
                }).then(() => {})
                    .catch(() => {});
            });

            autoUpdater.on('update-downloaded', () => {
                dialog.showMessageBox(
                    mainWindow,
                    {
                        type: 'info',
                        title: 'Restart Required',
                        message: 'A new version is detected. The application will exit for the update. Update now?',
                        buttons: ['Update now', 'No'],
                    },
                ).then(({ response }) => {
                    if (response === 1) return

                    if(mainWindow && !mainWindow.isDestroyed()) mainWindow.hide()

                    autoUpdater.quitAndInstall();
                    app.quit()
                });
            });

            autoUpdater.on('error', (error) => {
                dialog.showErrorBox('Update Error', `An error occurred while checking for updates: ${error.message}`);
            });

            app.on('quit', () => {
                if (tray) {
                    tray.destroy();
                }
            });

            app.on('second-instance', (event, commandLine, workingDirectory) => {
                    if (mainWindow) {
                        if (!mainWindow.isVisible()) {
                            mainWindow.show();
                        }

                        if (mainWindow.isMinimized()) mainWindow.restore();
                        mainWindow.focus();
                    }
                });

            app.on('activate', () => {
                if (BrowserWindow.getAllWindows().length === 0) {
                    createMainWindow(port)
                } else {
                    mainWindow.focus();
                }
            })
        })
        .catch(() => {
            AuthStorage.clear([AUTH_DATA])
        })

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit()
        }
    })

    app.on('web-contents-created', (event, contents) => {
        contents.on('did-finish-load', () => {
            contents.setZoomFactor(ZoomStorage.get())
        })
    })
}

