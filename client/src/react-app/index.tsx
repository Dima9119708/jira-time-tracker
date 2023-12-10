import React from 'react'
import ReactDOM from 'react-dom/client'
import './app/styles/index.css'
import QueryClientProvide from './app/QueryClientProvide/QueryClientProvide'
import ThemeProvider from './app/Theme/Theme'
import { RouterProvider } from 'react-router-dom'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { router } from './app/router/router'
import { Loader } from '@mantine/core'
import { Notifications } from '@mantine/notifications'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
    <QueryClientProvide>
        <ThemeProvider>
            <Notifications />
            <RouterProvider
                router={router}
                fallbackElement={
                    <div className="h-[100vh] flex-center">
                        <Loader />
                    </div>
                }
            />
        </ThemeProvider>

        <ReactQueryDevtools
            initialIsOpen={false}
            buttonPosition={'bottom-left'}
        />
    </QueryClientProvide>
)
