import { useEffect } from 'react'
import { electron } from '../../shared/lib/electron/electron'
import { useGlobalState } from '../../shared/lib/hooks/useGlobalState'

const NotificationsApp = () => {
    useEffect(() => {
        let interval: NodeJS.Timeout

        electron(({ ipcRenderer }) => {
            ipcRenderer.on('focus', () => {
                clearInterval(interval)
            })

            ipcRenderer.on('blur', () => {
                if (!useGlobalState.getState().settings.sendInactiveNotificationDisabled) {
                    clearInterval(interval)
                    return
                }

                interval = setInterval(() => {
                    ipcRenderer.send('notification', {
                        title: 'The task has not been taken into work.',
                        body: 'The application is running in the background, but no task has been taken into work.',
                    })
                }, useGlobalState.getState().settings.sendInactiveNotificationMillisecond)
            })
        })
    }, [])

    return null
}

export default NotificationsApp
