import { axiosInstance } from '../../../shared/config/api/api'
import { QueryClient } from '@tanstack/react-query'
import { redirect } from 'react-router-dom'
import { notifications } from '@mantine/notifications'
import { AxiosError } from 'axios'

export const loaderAuth = (queryClient: QueryClient) => async () => {
    try {
        const value = await queryClient.fetchQuery({
            queryKey: ['login'],
            queryFn: async () => {
                if (/host/.test(document.cookie)) {
                    const response = await axiosInstance.post('/login', {})

                    return response.data
                }

                return false
            },
            gcTime: Infinity,
        })

        if (!value) {
            throw new Error()
        }

        return null
    } catch (error) {
        if (error instanceof AxiosError) {
            notifications.show({
                title: error.message,
                message: '',
                color: 'red',
            })
        }

        return redirect('/auth')
    }
}
