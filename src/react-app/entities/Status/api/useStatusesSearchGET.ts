import { axiosInstance } from 'react-app/shared/config/api/api'
import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { JQLAutocompleteSuggestionsResponse } from '@atlaskit/jql-editor-autocomplete-rest'

interface StatusesResponse {
    values: Status[]
}

interface Status {
    name: string
    id: string
    statusCategory: 'TODO' | 'IN_PROGRESS' | 'DONE'
    usages: string[]
}

export const useStatusesSearchGET = (props: { projectIds: string[]; opened: boolean }) => {
    const { projectIds, opened } = props

    return useQuery({
        enabled: opened,
        queryKey: ['statuses'],
        queryFn: async () => {
            try {
                const responses = await Promise.all(
                    projectIds.length === 0
                        ? [
                            axiosInstance.get<StatusesResponse>('/statuses', {
                                params: {
                                    expand: 'workflowUsages,usages',
                                },
                            }),
                        ]
                        : projectIds.map((projectId) =>
                            axiosInstance.get<StatusesResponse>('/statuses', {
                                params: {
                                    projectId: projectId,
                                    expand: 'workflowUsages,usages',
                                },
                            })
                        )
                )

                const filteringByUsages = responses
                    .reduce((acc, response) => [...acc, ...response.data.values], [] as Status[])
                    .filter((status) => status.usages.length > 0)

                const filteringDuplicates = filteringByUsages.reduce((acc, status) => {
                    const isDuplicate = acc.some((s) => s.name === status.name)

                    if (!isDuplicate) {
                        acc.push(status)
                    }

                    return acc
                }, [] as Status[])

                return {
                    values: filteringDuplicates,
                }
            } catch (e) {
                if (e instanceof AxiosError) {
                    if (e.response?.status === 403) {
                        const response = await axiosInstance.get<JQLAutocompleteSuggestionsResponse>('/jql-search', {
                            params: {
                                url: '/rest/api/latest/jql/autocompletedata/suggestions?fieldName=status',
                            },
                        })

                        return {
                            values: response.data.results.map((result) => {
                                return {
                                    id: result.value,
                                    name: result.displayName,
                                    statusCategory: result.displayName.toUpperCase(),
                                    usages: [],
                                }
                            }) as Status[],
                        }
                    }
                }
            }

        },
    })
}
