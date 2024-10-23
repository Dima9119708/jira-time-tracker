import { axiosInstance } from 'react-app/shared/config/api/api'
import { useQueries, useQuery } from '@tanstack/react-query'
import { useGlobalBoolean } from 'use-global-boolean'
import { AxiosResponse } from 'axios'
import { produce } from 'immer'

interface StatusesResponse {
    values: Status[]
}

interface Status {
    name: string
    id: string
    statusCategory: 'TODO' | 'IN_PROGRESS' | 'DONE'
    usages: []
}

export const useStatusesSearch = (props: { projectIds: string[]; opened: boolean }) => {
    const { projectIds, opened } = props

    const dataQuery = useQuery({
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

    return dataQuery
}
