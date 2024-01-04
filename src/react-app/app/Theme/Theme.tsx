import { MantineProvider, createTheme } from '@mantine/core'
import { ReactNode } from 'react'

interface ThemeProviderProps {
    children: ReactNode
}

const theme = createTheme({
    /** Put your mantine theme override here */
    scale: 1.2,
})

const ThemeProvider = (props: ThemeProviderProps) => {
    const { children } = props

    return <MantineProvider theme={theme}>{children}</MantineProvider>
}

export default ThemeProvider
