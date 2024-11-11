import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from 'react-app/shared/config/api/api'
import { AxiosError } from 'axios'
import { JQLAutocompleteSuggestionsResponse } from '@atlaskit/jql-editor-autocomplete-rest'
import { Project } from 'react-app/shared/types/Jira/Issues'

interface PrioritySchemesResponse {
    values: {
        priorities: {
            values: PriorityScheme[]
        }
        projects: {
            values: Project[]
        }
    }[]
}

interface PriorityScheme {
    id: string
    name: string
    statusColor: string
    iconUrl: string
}

export const usePrioritySchemesGET = (props: { opened: boolean; projectIds?: string[] }) => {
    const { opened, projectIds } = props

    const dataQuery = useQuery({
        enabled: opened,
        queryKey: ['priority schemes'],
        queryFn: async () => {
            const reserveApi = async () => {
                const response = await axiosInstance.get<JQLAutocompleteSuggestionsResponse>('/jql-search', {
                    params: {
                        url: '/rest/api/latest/jql/autocompletedata/suggestions?fieldName=priority',
                    },
                })

                return response.data.results.map((result) => {
                    return {
                        id: result.value,
                        iconUrl: '',
                        name: result.displayName,
                        statusColor: '',
                    }
                }) as PriorityScheme[]
            }

            try {
                const response = await axiosInstance.get<PrioritySchemesResponse>('/priorityscheme', {
                    params: {
                        expand: 'priorities,projects',
                    },
                })

                if (response.data.values.length === 0) {
                    return reserveApi()
                }

                return response.data.values
                    .reduce((acc, scheme) => {
                        if (!projectIds || !projectIds.length) {
                            acc.push(...scheme.priorities.values)
                        } else {
                            const isInProject = scheme.projects.values.some((project) => projectIds.includes(project.id))

                            if (isInProject) {
                                acc.push(...scheme.priorities.values)
                            }
                        }

                        return acc
                    }, [] as PriorityScheme[])
                    .reduce((acc, scheme) => {
                        const isDuplicate = acc.some((s) => s.name === scheme.name)

                        if (!isDuplicate) {
                            acc.push(scheme)
                        }

                        return acc
                    }, [] as PriorityScheme[])
            } catch (e) {
                if (e instanceof AxiosError) {
                    if (e.response?.status === 403) {
                        return reserveApi()
                    }
                }
            }
        },
    })

    return dataQuery
}
