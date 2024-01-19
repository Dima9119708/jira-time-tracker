import { axiosInstance } from '../../shared/config/api/api'

axiosInstance.interceptors.request.use((request) => {
    return request
})
