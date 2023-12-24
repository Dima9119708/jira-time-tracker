import { createHashRouter, createBrowserRouter, Navigate, RouteObject } from 'react-router-dom'
import AuthPage from '../../pages/Auth/ui/AuthPage'
import { queryClient } from '../QueryClientProvide/QueryClientProvide'
import { loaderAuth } from '../../features/authByEmailAndToken'
import LayoutRoot from '../LayoutRoot/LayoutRoot'

const createRouter = (routes: RouteObject[]) => {
    return __BUILD_ENV__ === 'browser'
        ? createBrowserRouter(routes, { basename: __BASE_APP_ROUTE__ })
        : createHashRouter(routes, { basename: __BASE_APP_ROUTE__ })
}

export const router = createRouter([
    {
        path: '/',
        Component: LayoutRoot,
        loader: loaderAuth(queryClient),
        shouldRevalidate: (args) => false,
        children: [
            {
                index: true,
                path: 'filters',
                shouldRevalidate: (args) => false,
                lazy: async () => {
                    const { loaderFilters, FiltersPage } = await import('../../pages/Filters')

                    return {
                        loader: loaderFilters(queryClient),
                        Component: FiltersPage,
                    }
                },
            },
            {
                path: '/',
                element: <Navigate to="projects" />,
            },
            {
                path: '*',
                element: <div>Not Found</div>,
            },
        ],
    },
    {
        path: `auth`,
        Component: AuthPage,
    },
    {
        path: '*',
        element: <div>Not Found</div>,
    },
])
