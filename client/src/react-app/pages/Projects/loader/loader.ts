import { queryGetProjects } from '../model/queryOptions'
import { QueryClient } from '@tanstack/react-query'

export const loaderProjects = (queryClient: QueryClient) => async () => {
    queryClient.prefetchQuery(queryGetProjects())
    return true
}
