import React from 'react'
import ReactDOM from 'react-dom/client'
import '@mantine/core/styles.css'
import App from './app/App'
import QueryClientProvide from './app/QueryClientProvide/QueryClientProvide'
import ThemeProvider from './app/Theme/Theme'
import { MemoryRouter } from 'react-router-dom'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
    <QueryClientProvide>
        <ThemeProvider>
            <MemoryRouter>
                <App />
            </MemoryRouter>
        </ThemeProvider>
    </QueryClientProvide>
)
