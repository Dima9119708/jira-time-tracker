import { useEffect } from 'react'
import { electron } from '../../../shared/lib/electron/electron'
import { useGlobalState } from '../../../shared/lib/hooks/useGlobalState'

const DetectedSystemIdle = () => {
    useEffect(() => {
        const unsubscribe = electron(({ ipcRenderer }) => {
            let interval = setInterval(() => {
                ipcRenderer.send('GET-SYSTEM-IDLE-TIME')
            }, 1000)

            const onSuspend = () => {
                useGlobalState.getState().setTimeLoggingPaused(true)
            }

            const onResume = () => {
                useGlobalState.getState().setTimeLoggingPaused(false)
            }

            const onTimeLoggingPaused = (seconds: number) => {
                if (useGlobalState.getState().settings.systemIdle.enabled) {
                    const settingsSecond = useGlobalState.getState().settings.systemIdle.second
                    const isTimeLoggingPaused = useGlobalState.getState().isTimeLoggingPaused

                    if (seconds >= settingsSecond) {
                        if (isTimeLoggingPaused === true) return

                        useGlobalState.getState().setTimeLoggingPaused(true)
                    } else {
                        if (isTimeLoggingPaused === false) return

                        useGlobalState.getState().setTimeLoggingPaused(false)
                    }
                }

            }

            let activeTime = 0
            let preSeconds = 0

            const onIdleWithInsufficientActivity = (seconds: number) => {
                const isIdleWithInsufficientActivity = useGlobalState.getState().isIdleWithInsufficientActivity

                if (seconds === 0 && preSeconds === 0) {
                    activeTime += 1
                }

                if (seconds === 0 && preSeconds > 0) {
                    activeTime = 0
                }

                preSeconds = seconds


                if (activeTime < 60 && seconds > 60) {
                    if (isIdleWithInsufficientActivity === true) return
                    useGlobalState.getState().setIdleWithInsufficientActivity(true)
                } else {
                    if (isIdleWithInsufficientActivity === false) return
                    useGlobalState.getState().setIdleWithInsufficientActivity(false)
                }


            }

            const onSystemIdleTimeResponse = (event: Electron.IpcRendererEvent, seconds: number) => {
                onTimeLoggingPaused(seconds)
                onIdleWithInsufficientActivity(seconds)
            }

            ipcRenderer.on('SYSTEM-IDLE-TIME-RESPONSE', onSystemIdleTimeResponse)
            ipcRenderer.on('SUSPEND', onSuspend)
            ipcRenderer.on('RESUME', onResume)
            return () => {
                clearInterval(interval)
                ipcRenderer.removeListener('SUSPEND', onSuspend)
                ipcRenderer.removeListener('RESUME', onResume)
                ipcRenderer.removeListener('SYSTEM-IDLE-TIME-RESPONSE', onSystemIdleTimeResponse)
            }
        })

        return () => {
            unsubscribe()
        }
    }, [])

    return null
}

export default DetectedSystemIdle
