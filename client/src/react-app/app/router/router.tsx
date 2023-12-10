import { createBrowserRouter, Navigate } from 'react-router-dom'
import AuthPage from '../../pages/Auth/ui/AuthPage'
import { loaderProjects } from '../../pages/Projects/loader/loader'
import { queryClient } from '../QueryClientProvide/QueryClientProvide'
import { loaderAuth } from '../../features/authByEmailAndToken'
import LayoutRoot from '../LayoutRoot/LayoutRoot'
import { loaderTasks } from '../../pages/Tasks'
import { loaderBoards } from '../../pages/Boards'

export const router = createBrowserRouter([
    {
        path: '',
        Component: LayoutRoot,
        loader: loaderAuth(queryClient),
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
                path: 'boards/:projectId',
                loader: loaderBoards(queryClient),
                lazy: async () => {
                    const component = await import('../../pages/Boards/ui/BoardsPage')

                    return {
                        Component: component.default,
                    }
                },
            },
            {
                path: 'tasks/:projectId/:boardId',
                loader: loaderTasks(queryClient),
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
