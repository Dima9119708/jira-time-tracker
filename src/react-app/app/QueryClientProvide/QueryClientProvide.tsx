import { QueryClient, QueryClientProvider, focusManager } from '@tanstack/react-query'
import { ReactNode } from 'react'
import { electron } from 'react-app/shared/lib/electron/electron'

interface QueryClientProvideProps {
    children: ReactNode
}

export const queryClient = new QueryClient()

focusManager.setEventListener((handleFocus) => {
    const unsubscribe = electron((methods) => {
        const onFocus = () => handleFocus(true)
        const onBlur = () => handleFocus(false)

        methods.ipcRenderer.on('FOCUS', () => handleFocus(true))
        methods.ipcRenderer.on('BLUR', () => handleFocus(false))

        return () => {
            methods.ipcRenderer.removeListener('FOCUS', onFocus)
            methods.ipcRenderer.removeListener('BLUR', onBlur)
        }
    })

    return () => {
        unsubscribe()
    }
})

const QueryClientProvide = (props: QueryClientProvideProps) => {
    const { children } = props

    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

export default QueryClientProvide
