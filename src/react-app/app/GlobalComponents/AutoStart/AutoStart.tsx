import { useGlobalState } from '../../../shared/lib/hooks/useGlobalState'
import { useEffect } from 'react'
import { electron } from '../../../shared/lib/electron/electron'

const AutoStart = () => {
    const autoStart = useGlobalState((state) => state.settings.autoStart)

    useEffect(() => {
        electron(({ ipcRenderer }) => {
            ipcRenderer.send('AUTO-START', autoStart)
        })
    }, [autoStart])

    return null
}

export default AutoStart
