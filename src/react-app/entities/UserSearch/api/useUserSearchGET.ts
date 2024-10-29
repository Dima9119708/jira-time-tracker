import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from 'react-app/shared/config/api/api'
import { User } from 'react-app/shared/types/Jira/UserSearch'

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

            return response.data.filter((user) => user.accountType !== 'app' && user.active)
        },
    })
}
