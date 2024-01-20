import { axiosInstance } from '../../shared/config/api/api'
import { electron } from '../../shared/lib/electron/electron'

axiosInstance.interceptors.response.use(undefined, async function (error) {
    const originalRequest = error.config

    if (error.response.status === 401 && !originalRequest._retry) {
        const authData = await electron((methods) => methods.ipcRenderer.invoke('GET_AUTH_DATA'))

        if (authData?.type === 'OAuth2') {
            originalRequest._retry = true

            await axiosInstance.post('/refresh-token')

            return axiosInstance(originalRequest)
        }
    }

    return Promise.reject(error)
})
