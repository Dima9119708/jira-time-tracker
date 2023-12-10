import { QueryClient } from '@tanstack/react-query'
import { queryGetBoardColumns } from '../model/queryOption'
import { LoaderFunction } from 'react-router-dom'

export const loaderTasks =
    (queryClient: QueryClient): LoaderFunction =>
    ({ params }) => {
        params.boardId && queryClient.prefetchQuery(queryGetBoardColumns(params.boardId))

        return true
    }
