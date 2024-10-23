import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from 'react-app/shared/config/api/api'
import { Project } from 'react-app/entities/Projects/lib/useGetProjects'

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

export const useGetPrioritySchemes = (props: { opened: boolean; projectIds?: string[] }) => {
    const { opened, projectIds } = props

    const dataQuery = useQuery({
        enabled: opened,
        queryKey: ['priority schemes'],
        queryFn: async () => {
            const response = await axiosInstance.get<PrioritySchemesResponse>('/priorityscheme', {
                params: {
                    expand: 'priorities,projects',
                },
            })

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
        },
    })

    return dataQuery
}
