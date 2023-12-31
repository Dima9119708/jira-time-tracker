import { infiniteQueryOptions } from '@tanstack/react-query'
import { axiosInstance } from '../../../shared/config/api/api'
import { CommentsResponse } from '../types/types'

export const queryGetComments = (issueId: string) =>
    infiniteQueryOptions({
        queryKey: ['comments', issueId],
        queryFn: async () =>
            await axiosInstance
                .get<CommentsResponse>('/issue-comment', {
                    params: {
                        id: issueId,
                    },
                })
                .then((res) => res.data),
        initialPageParam: 0,
        getNextPageParam: () => {
            return null
        },
    })
