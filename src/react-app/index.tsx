import ReactDOM from 'react-dom/client'

import '@atlaskit/css-reset'

import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import isToday from 'dayjs/plugin/isToday'
import isSameOrAfter from "dayjs/plugin/isSameOrAfter"
import isSameOrBefore from "dayjs/plugin/isSameOrBefore"
import QueryClientProvide from './app/QueryClientProvide/QueryClientProvide'
import { RouterProvider } from 'react-router-dom'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import './app/AxiosInterceptorsGlobal/axiosInterceptorsGlobal'
import { router } from './app/router/router'

import AppProvider from '@atlaskit/app-provider'
import { FlagsProvider } from '@atlaskit/flag'
import { electron } from 'react-app/shared/lib/electron/electron'
import Spinner from '@atlaskit/spinner'
import { Box, xcss } from '@atlaskit/primitives'

dayjs.extend(duration)
dayjs.extend(isToday)
dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

const DEFAULT_COLOR_MODE = electron((methods) => methods.ipcRenderer.sendSync('GET_THEME'))

root.render(
    <QueryClientProvide>
        <AppProvider defaultColorMode={DEFAULT_COLOR_MODE}>
            <FlagsProvider>
                <RouterProvider
                    router={router}
                    fallbackElement={
                        <Box
                            xcss={xcss({
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: '100vh',
                            })}
                        >
                            <Spinner />
                        </Box>
                    }
                />

                <ReactQueryDevtools
                    initialIsOpen={false}
                    buttonPosition={'bottom-left'}
                />
            </FlagsProvider>
        </AppProvider>
    </QueryClientProvide>
)
