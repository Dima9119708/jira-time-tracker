import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '../../../shared/config/api/api'
import { useNavigate } from 'react-router-dom'
import { BaseAuthFormFields } from '../types'

export const useAuthByEmailAndToken = () => {
    const navigate = useNavigate()

    const { data, isFetching } = useQuery({
        queryKey: ['login'],
        queryFn: async () => {
            const response = await axiosInstance.post('/login', {})

            navigate('/projects')
            return !!response.data
        },
        enabled: /host/.test(document.cookie),
    })

    return {
        isFetching,
        isAuthorized: data,
    }
}
