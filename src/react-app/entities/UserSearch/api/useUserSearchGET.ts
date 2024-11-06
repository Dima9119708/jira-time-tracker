import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from 'react-app/shared/config/api/api'
import { User } from 'react-app/shared/types/Jira/UserSearch'
import { UNASSIGNED_USER } from '../constants/defaultUser'

export const useUserSearchGET = ({ opened }: { opened: boolean }) => {
    return useQuery({
        enabled: opened,
        queryKey: ['find users'],
        queryFn: async () => {
            const response = await axiosInstance.get<User[]>('/user/search', {
                params: {
                    query: '',
                },
            })

            const users = response.data.filter((user) => user.accountType !== 'app' && user.active)

            users.push(UNASSIGNED_USER)

            return users
        },
    })
}
