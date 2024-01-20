import { useEffect } from 'react'
import { electron } from '../../../shared/lib/electron/electron'
import { useGlobalState } from '../../../shared/lib/hooks/useGlobalState'

const DetectedSystemIdle = () => {
    useEffect(() => {
        let interval: NodeJS.Timeout

        const unsubscribe = electron(({ ipcRenderer }) => {
            interval = setInterval(() => {
                if (!useGlobalState.getState().settings.systemIdle.enabled) return

                ipcRenderer.send('GET-SYSTEM-IDLE-TIME')
            }, 1000)

            const onSuspend = () => {
                useGlobalState.getState().setSystemIdle(true)
            }

            const onResume = () => {
                useGlobalState.getState().setSystemIdle(false)
            }

            const onSystemIdleTimeResponse = (event: Electron.IpcRendererEvent, seconds: number) => {
                const settingsSecond = useGlobalState.getState().settings.systemIdle.second

                if (seconds >= settingsSecond) {
                    useGlobalState.getState().setSystemIdle(true)
                } else {
                    useGlobalState.getState().setSystemIdle(false)
                }
            }

            ipcRenderer.on('SYSTEM-IDLE-TIME-RESPONSE', onSystemIdleTimeResponse)
            ipcRenderer.on('SUSPEND', onSuspend)
            ipcRenderer.on('RESUME', onResume)

            return () => {
                ipcRenderer.removeListener('SUSPEND', onSuspend)
                ipcRenderer.removeListener('RESUME', onResume)
                ipcRenderer.removeListener('SYSTEM-IDLE-TIME-RESPONSE', onSystemIdleTimeResponse)
            }
        })

        return () => {
            clearInterval(interval)
            unsubscribe()
        }
    }, [])

    return null
}

export default DetectedSystemIdle
