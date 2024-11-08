import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from 'react-app/shared/config/api/api'
import { Project } from 'react-app/entities/Projects/api/useProjectsGET'
import { AxiosError } from 'axios'
import { JQLAutocompleteSuggestionsResponse } from '@atlaskit/jql-editor-autocomplete-rest'

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
            try {
                const response = await axiosInstance.get<PrioritySchemesResponse>('/priorityscheme', {
                    params: {
                        expand: 'priorities,projects',
                    },
                })

                if (response.data.values.length === 0) {
                    // @ts-ignore
                    throw new AxiosError(undefined, undefined, undefined, undefined, { status: 403 })
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
                }
            }
        },
    })

    return dataQuery
}
