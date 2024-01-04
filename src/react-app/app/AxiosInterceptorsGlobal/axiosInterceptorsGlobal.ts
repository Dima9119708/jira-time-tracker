import { axiosInstance } from '../../shared/config/api/api'

axiosInstance.interceptors.request.use((request) => {
    const encodedAuth = localStorage.getItem('encodedAuth')
    const jiraSubDomain = localStorage.getItem('jiraSubDomain')

    request.headers.set('encodedAuth', encodedAuth)
    request.headers.set('jiraSubDomain', jiraSubDomain)

    return request
})
