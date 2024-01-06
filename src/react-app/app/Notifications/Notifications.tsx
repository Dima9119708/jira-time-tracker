import { useEffect } from 'react'
import { electron } from '../../shared/lib/electron/electron'
import { useGlobalState } from '../../shared/lib/hooks/useGlobalState'

const Notifications = () => {
    useEffect(() => {
        let interval: NodeJS.Timeout

        electron(({ ipcRenderer }) => {
            ipcRenderer.on('FOCUS', () => {
                clearInterval(interval)
            })

            ipcRenderer.on('BLUR', () => {
                const sendInactiveNotificationSwitch = !useGlobalState.getState().settings.sendInactiveNotification.enabled
                const isIds = !!useGlobalState.getState().issueIdsSearchParams.currentParams

                if (sendInactiveNotificationSwitch || isIds) {
                    clearInterval(interval)
                    return
                }

                interval = setInterval(() => {
                    ipcRenderer.send('NOTIFICATION', {
                        title: 'The task has not been taken into work.',
                        body: 'The application is running in the background, but no task has been taken into work.',
                    })
                }, useGlobalState.getState().settings.sendInactiveNotification.millisecond)
            })
        })
    }, [])

    return null
}

export default Notifications
