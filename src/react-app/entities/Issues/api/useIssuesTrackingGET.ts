import { AxiosError } from 'axios'
import { ErrorType } from 'react-app/shared/types/Jira/ErrorType'
import { useQuery } from '@tanstack/react-query'
import { useGlobalState } from 'react-app/shared/lib/hooks/useGlobalState'
import { axiosInstance } from 'react-app/shared/config/api/api'
import { IssueResponse } from 'react-app/shared/types/Jira/Issues'

export const useIssuesTrackingGET = (props: { onReject?: (reject: AxiosError<ErrorType>) => void }) => {
    return useQuery({
        queryKey: ['issues tracking'],
        queryFn: async (context) => {
            const tasksIDS = useGlobalState.getState().getIssueIdsSearchParams()

            if (tasksIDS) {
                const ids = tasksIDS.split(',')

                const responses = await Promise.allSettled([
                        axiosInstance.get<IssueResponse>('/issues', {
                            params: {
                                jql: `issue in (${ids.join(',')})`,
                                maxResults: ids.length,
                            },
                            signal: context.signal,
                        })
                    ]
                )

                return responses.reduce<IssueResponse['issues']>((acc, response) => {
                    if (response.status === 'fulfilled') {
                        acc.push(...response.value.data.issues)
                    }

                    if (response.status === 'rejected') {
                        const reject = response.reason as AxiosError<ErrorType>

                        useGlobalState.getState().changeIssueIdsSearchParams('delete', response.reason.config.params.id)

                        if (props.onReject) {
                            props.onReject(reject)
                        }
                    }

                    return acc
                }, [])
            }

            return []
        },
    })
}
