import { QueryClient } from '@tanstack/react-query'
import { queryGetTasks, queryGetTasksTracking } from '../model/queryOption'
import { LoaderFunction } from 'react-router-dom'

export const loaderTasks =
    (queryClient: QueryClient): LoaderFunction =>
    ({ params, request }) => {
        const keysTasksTracking = new URL(request.url).searchParams.get('keysTaskTracking')

        params.boardId && queryClient.prefetchQuery(queryGetTasks(params.boardId, keysTasksTracking))

        if (!!keysTasksTracking) {
            queryClient.prefetchQuery(queryGetTasksTracking(params.boardId!, keysTasksTracking))
        }

        return true
    }
