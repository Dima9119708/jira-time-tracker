import { axiosInstance } from '../../../shared/config/api/api'
import { QueryClient } from '@tanstack/react-query'
import { redirect } from 'react-router-dom'
import { electron } from '../../../shared/lib/electron/electron'

export const loaderAuth = (queryClient: QueryClient) => async () => {
    try {
        const authData = await electron((methods) => methods.ipcRenderer.invoke('GET_AUTH_DATA'))

        if (authData) {
            await queryClient.fetchQuery({
                queryKey: ['login'],
                queryFn: async () => {
                    const response = await axiosInstance.get('/login')

                    return response.data
                },
                gcTime: Infinity,
            })
        } else {
            throw new Error()
        }

        return null
    } catch (error) {
        return redirect('auth')
    }
}
