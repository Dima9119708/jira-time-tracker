import { useEffect, useMemo, useRef } from 'react'
import { electron } from '../../../shared/lib/electron/electron'
import { useGlobalState } from '../../../shared/lib/hooks/useGlobalState'
import notifyMusic from 'react-app/shared/assets/music/supercell.wav'
import { useWatchBoolean } from 'use-global-boolean'

const Notifications = () => {
    const [isUnauthorizedPlugin] = useWatchBoolean('UNAUTHORIZED PLUGIN')
    const pluginLogoutAlertsTimeoutRef = useRef<NodeJS.Timeout>()

    const audio = useMemo(() => {
        const _audio = new Audio(notifyMusic)

        _audio.load()

        return _audio
    }, [])

    useEffect(() => {
        let interval: NodeJS.Timeout

        const unsubscribe = electron(({ ipcRenderer }) => {
            const listenerFocus = () => {
                clearInterval(interval)
                clearInterval(pluginLogoutAlertsTimeoutRef.current)
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
                        title: 'The issue has not been taken into work.',
                        body: 'The application is running in the background, but no issue has been taken into work.'
                    })

                    audio.pause()
                    audio.currentTime = 0

                    audio.play()
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

    useEffect(() => {
        if (isUnauthorizedPlugin) {
            const pluginName = useGlobalState.getState().settings.plugin

            return electron(({ ipcRenderer }) => {
                const isFocused = ipcRenderer.sendSync('IS_FOCUSED')

                if (isFocused) return

                const pluginLogoutAlertsEnabled = useGlobalState.getState().settings.pluginLogoutAlerts.enabled

                if (!pluginLogoutAlertsEnabled) {
                    clearInterval(pluginLogoutAlertsTimeoutRef.current)
                    return
                }

                const sendNotify = () => {
                    ipcRenderer.send('NOTIFICATION', {
                        title: `Connection Lost to ${pluginName}`,
                        body: `The connection to ${pluginName} has been disconnected due to your session expiring. To continue using all features, please log in again.`,
                    })

                    audio.pause()
                    audio.currentTime = 0

                    audio.play()
                }

                sendNotify()

                clearInterval(pluginLogoutAlertsTimeoutRef.current)
                pluginLogoutAlertsTimeoutRef.current = setInterval(sendNotify, useGlobalState.getState().settings.pluginLogoutAlerts.millisecond)
            })
        }

    }, [isUnauthorizedPlugin])

    return null
}

export default Notifications
