import { FunctionComponent } from 'react'
import { useGlobalState } from '../../../shared/lib/hooks/useGlobalState'

interface OpenSettingsProps {
    children: FunctionComponent<{ open: boolean }>
}

const OpenSettings = (props: OpenSettingsProps) => {
    const open = useGlobalState((state) => state.openSettings)

    return props.children({ open })
}

export default OpenSettings
