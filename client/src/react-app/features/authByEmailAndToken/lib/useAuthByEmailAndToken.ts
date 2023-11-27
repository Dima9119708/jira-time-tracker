import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { axiosInstance } from '../../../shared/config/api/api'

export const useAuthByEmailAndToken = () => {
    const navigate = useNavigate()

    const { data, isFetching } = useQuery({
        queryKey: ['login'],
        queryFn: async () => {
            if (/host/.test(document.cookie)) {
                const response = await axiosInstance.post('/login', {})

                return !!response.data
            }

            return false
        },
    })

    useEffect(() => {
        if (data) {
            navigate('/projects')
        }
    }, [data])

    return {
        isFetching,
        isAuthorized: data,
    }
}
