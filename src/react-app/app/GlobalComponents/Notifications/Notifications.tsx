import { useEffect } from 'react'
import { electron } from '../../../shared/lib/electron/electron'
import { useGlobalState } from '../../../shared/lib/hooks/useGlobalState'

const Notifications = () => {
    useEffect(() => {
        let interval: NodeJS.Timeout

        const unsubscribe = electron(({ ipcRenderer }) => {
            const listenerFocus = () => {
                clearInterval(interval)
            }

            const listenerBlur = () => {
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
            }

            ipcRenderer.on('FOCUS', listenerFocus)
            ipcRenderer.on('BLUR', listenerBlur)

            return () => {
                ipcRenderer.removeListener('FOCUS', listenerFocus)
                ipcRenderer.removeListener('BLUR', listenerBlur)
            }
        })

        return () => unsubscribe()
    }, [])

    return null
}

export default Notifications
