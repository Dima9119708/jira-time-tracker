import { useEffect } from 'react'
import { electron } from '../../shared/lib/electron/electron'
import { useGlobalState } from '../../shared/lib/hooks/useGlobalState'

const DetectedSystemIdle = () => {
    useEffect(() => {
        let interval: NodeJS.Timeout

        electron(({ ipcRenderer }) => {
            interval = setInterval(() => {
                if (!useGlobalState.getState().settings.systemIdle.enabled) return

                ipcRenderer.send('GET-SYSTEM-IDLE-TIME')
            }, 1000)

            ipcRenderer.on('SYSTEM-IDLE-TIME-RESPONSE', (event, seconds) => {
                const settingsSecond = useGlobalState.getState().settings.systemIdle.second

                if (seconds >= settingsSecond) {
                    useGlobalState.setState((state) => {
                        state.isSystemIdle = true
                    })
                } else {
                    useGlobalState.setState((state) => {
                        state.isSystemIdle = false
                    })
                }
            })
        })

        return () => {
            clearInterval(interval)
        }
    }, [])

    return null
}

export default DetectedSystemIdle
