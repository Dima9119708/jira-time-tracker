import { createHashRouter, createBrowserRouter, Navigate, RouteObject } from 'react-router-dom'
import AuthPage from '../../pages/Auth/ui/AuthPage'
import { queryClient } from '../QueryClientProvide/QueryClientProvide'
import { loaderAuth } from '../../features/AuthByEmailAndToken'
import LayoutRoot from '../LayoutRoot/LayoutRoot'

const createRouter = (routes: RouteObject[]) => {
    return createHashRouter(routes, { basename: __BASE_APP_ROUTE__ })
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
                path: 'tasks',
                shouldRevalidate: (args) => false,
                lazy: async () => {
                    const { loaderTasks, TasksPage } = await import('../../pages/Tasks')

                    return {
                        loader: loaderTasks(queryClient),
                        Component: TasksPage,
                    }
                },
            },
            {
                path: '/',
                element: <Navigate to="tasks" />,
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
