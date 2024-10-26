import { createHashRouter, createBrowserRouter, Navigate, RouteObject } from 'react-router-dom'
import AuthPage from '../../pages/Auth/ui/AuthPage'
import { queryClient } from '../QueryClientProvide/QueryClientProvide'
import { loaderAuth } from '../../features/AuthByEmailAndToken'
import LayoutRoot from '../LayoutRoot/LayoutRoot'
import { ChangePort } from '../../pages/ChangePort'
import { TopPanel } from 'react-app/widgets/TopPanel'
import AuthPlugin from 'react-app/pages/AuthPlugin/ui/AuthPlugin'

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
                loader: loaderAuth(queryClient),
                shouldRevalidate: () => false,
                children: [
                    {
                        index: true,
                        path: 'issues',
                        shouldRevalidate: () => false,
                        lazy: async () => {
                            const { loaderIssues, IssuesPage, ErrorBoundary } = await import('../../pages/Issues')

                            return {
                                loader: loaderIssues,
                                Component: IssuesPage,
                                errorElement: <ErrorBoundary />,
                            }
                        },
                    },
                    {
                        path: 'auth-plugin',
                        lazy: async () => {
                            const { loaderIssues, ErrorBoundary } = await import('../../pages/Issues')

                            return {
                                loader: loaderIssues,
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
