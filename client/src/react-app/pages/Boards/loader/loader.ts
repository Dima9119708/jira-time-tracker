import { QueryClient } from '@tanstack/react-query/build/modern'
import { queryGetBoards } from '../model/queryOptions'
import { LoaderFunction } from 'react-router-dom'

export const loaderBoards =
    (queryClient: QueryClient): LoaderFunction =>
    ({ params }) => {
        queryClient.prefetchQuery(queryGetBoards(params.projectId!))
        return true
    }
