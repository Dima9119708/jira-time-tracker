import { axiosInstance } from 'react-app/shared/config/api/api'
import { useQuery } from '@tanstack/react-query'

interface StatusesResponse {
    values: Status[]
}

interface Status {
    name: string
    id: string
    statusCategory: 'TODO' | 'IN_PROGRESS' | 'DONE'
    usages: []
}

export const useStatusesSearchGET = (props: { projectIds: string[]; opened: boolean }) => {
    const { projectIds, opened } = props

    return useQuery({
        enabled: opened,
        queryKey: ['statuses'],
        queryFn: async () => {
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
        },
    })
}
