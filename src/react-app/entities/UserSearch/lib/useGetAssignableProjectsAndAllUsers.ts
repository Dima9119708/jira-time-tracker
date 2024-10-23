import { axiosInstance } from 'react-app/shared/config/api/api'
import { useQuery } from '@tanstack/react-query'
import { Assignee } from 'react-app/pages/Issues/types/types'

interface AssignableProjectsUsersResponse extends Assignee {
    accountId: string
    accountType: 'app' | string
    active: boolean
}

export const useGetAssignableProjectsAndAllUsers = (props: { projectKeys: string[]; opened: boolean }) => {
    const { projectKeys, opened } = props

    return useQuery({
        enabled: opened,
        queryKey: ['projects', 'users'],
        queryFn: async () => {
            const response =
                projectKeys.length === 0
                    ? await axiosInstance.get<AssignableProjectsUsersResponse[]>('/user/search', {
                          params: {
                              query: '',
                          },
                      })
                    : await axiosInstance.get<AssignableProjectsUsersResponse[]>('/user/assignable/multiProjectSearch', {
                          params: {
                              query: '',
                              projectKeys: projectKeys.join(','),
                          },
                      })

            return response.data.filter((user) => user.accountType !== 'app' && user.active)
        },
    })
}
