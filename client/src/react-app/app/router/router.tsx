import { createBrowserRouter, Navigate } from 'react-router-dom'
import AuthPage from '../../pages/Auth/ui/AuthPage'
import { loaderProjects } from '../../pages/Projects/loader/loader'
import { queryClient } from '../QueryClientProvide/QueryClientProvide'
import { loaderAuth } from '../../features/authByEmailAndToken'
import LayoutRoot from '../LayoutRoot/LayoutRoot'
import { loaderTasks } from '../../pages/Tasks'

export const router = createBrowserRouter([
    {
        path: '',
        Component: LayoutRoot,
        loader: loaderAuth(queryClient),
        shouldRevalidate: (args) => false,
        children: [
            {
                index: true,
                path: 'projects',
                loader: loaderProjects(queryClient),
                lazy: async () => {
                    const component = await import('../../pages/Projects/ui/ProjectsPage')

                    return {
                        Component: component.default,
                    }
                },
            },
            {
                path: 'tasks/:boardId',
                loader: loaderTasks(queryClient),
                shouldRevalidate: () => false,
                lazy: async () => {
                    const component = await import('../../pages/Tasks/ui/TasksPage')

                    return {
                        Component: component.default,
                    }
                },
            },
            {
                path: '',
                element: <Navigate to="projects" />,
            },
        ],
    },
    {
        path: 'auth',
        Component: AuthPage,
    },
])
