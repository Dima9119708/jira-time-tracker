import { axiosInstance } from 'react-app/shared/config/api/api'
import { useQuery } from '@tanstack/react-query'
import { User } from 'react-app/shared/types/Jira/UserSearch'
import { UNASSIGNED_USER } from 'react-app/entities/UserSearch/constants/defaultUser'

export const useAssignableMultiProjectSearchGET = (props: { projectKeys: string[]; opened: boolean }) => {
    const { projectKeys, opened } = props

    return useQuery({
        enabled: opened,
        queryKey: ['assignable multi project search'],
        queryFn: async () => {
            const response = await axiosInstance.get<User[]>('/user/assignable/multiProjectSearch', {
                params: {
                    query: '',
                    projectKeys: projectKeys.join(','),
                },
            })

            const users = response.data.filter((user) => user.accountType !== 'app' && user.active)

            users.push(UNASSIGNED_USER)

            return users
        },
    })
}
