import { createHashRouter, createBrowserRouter, Navigate, RouteObject } from 'react-router-dom'
import AuthPage from '../../pages/Auth/ui/AuthPage'
import { queryClient } from '../QueryClientProvide/QueryClientProvide'
import LayoutRoot from '../LayoutRoot/LayoutRoot'
import { ChangePort } from '../../pages/ChangePort'
import { TopPanel } from 'react-app/widgets/TopPanel'
import { loaderAuthAppInitial } from 'react-app/features/AuthInitialApp'

const createRouter = (routes: RouteObject[]) => {
    return __BUILD_ENV__ === 'browser'
        ? createBrowserRouter(routes, { basename: __BASE_APP_ROUTE__ })
        : createHashRouter(routes, { basename: __BASE_APP_ROUTE__ })
}

export const router = createRouter([
    {
        path: '/',
        Component: TopPanel,
        children: [
            {
                path: '/',
                Component: LayoutRoot,
                loader: loaderAuthAppInitial(queryClient),
                shouldRevalidate: () => false,
                children: [
                    {
                        index: true,
                        path: 'issues',
                        shouldRevalidate: () => false,
                        lazy: async () => {
                            const { IssuesPage, ErrorBoundary } = await import('../../pages/Issues')

                            return {
                                Component: IssuesPage,
                                errorElement: <ErrorBoundary />,
                            }
                        },
                    },
                    {
                        path: 'auth-plugin',
                        shouldRevalidate: () => false,
                        lazy: async () => {
                            const { ErrorBoundary } = await import('../../pages/Issues')
                            const { AuthPlugin } = await import('../../pages/AuthPlugin')

                            return {
                                Component: AuthPlugin,
                                errorElement: <ErrorBoundary />,
                            }
                        },
                    },
                    {
                        path: '/',
                        element: <Navigate to="issues" />,
                    },
                    {
                        path: '*',
                        element: <Navigate to="issues" />,
                    },
                ],
            },
            {
                path: `auth`,
                Component: AuthPage,
            },
            {
                path: `component-change-port`,
                Component: ChangePort,
            },
            {
                path: '*',
                element: <div>Not Found</div>,
            },
        ],
    },
])
