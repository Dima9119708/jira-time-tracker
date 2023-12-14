import { createHashRouter, createBrowserRouter, Navigate, RouteObject } from 'react-router-dom'
import AuthPage from '../../pages/Auth/ui/AuthPage'
import { queryClient } from '../QueryClientProvide/QueryClientProvide'
import { loaderAuth } from '../../features/authByEmailAndToken'
import LayoutRoot from '../LayoutRoot/LayoutRoot'

const createRouter = (routes: RouteObject[]) => (__BUILD_ENV__ === 'browser' ? createBrowserRouter(routes) : createHashRouter(routes))

export const router = createRouter([
    {
        path: __BASE_APP_ROUTE__,
        Component: LayoutRoot,
        loader: loaderAuth(queryClient),
        shouldRevalidate: (args) => false,
        children: [
            {
                index: true,
                path: 'projects',
                lazy: async () => {
                    const { loaderProjects, ProjectsPage } = await import('../../pages/Projects')

                    return {
                        loader: loaderProjects(queryClient),
                        Component: ProjectsPage,
                    }
                },
            },
            {
                path: 'tasks/:boardId',
                shouldRevalidate: () => false,
                lazy: async () => {
                    const { loaderTasks, TasksPage } = await import('../../pages/Tasks')

                    return {
                        Component: TasksPage,
                        loader: loaderTasks(queryClient),
                    }
                },
            },
            {
                path: '',
                element: <Navigate to="projects" />,
            },
            {
                path: '*',
                element: <div>Not Found</div>,
            },
        ],
    },
    {
        path: `${__BASE_APP_ROUTE__}/auth`,
        Component: AuthPage,
    },
    {
        path: '*',
        element: <div>Not Found</div>,
    },
])
