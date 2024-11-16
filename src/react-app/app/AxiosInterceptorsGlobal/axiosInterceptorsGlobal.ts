import { axiosInstance, axiosInstancePlugin } from '../../shared/config/api/api'
import { electron } from '../../shared/lib/electron/electron'
import { globalBooleanActions } from 'use-global-boolean'

axiosInstance.interceptors.response.use(undefined, async function (error) {
    const originalRequest = error.config

    if (error.response.status === 401 && !originalRequest._retry) {
        const authData = await electron((methods) => methods.ipcRenderer.invoke('GET_AUTH_DATA'))

        if (authData?.type === 'OAuth2') {
            originalRequest._retry = true

            await axiosInstance.post('/refresh-token')

            return axiosInstance(originalRequest)
        } else {
            globalBooleanActions.setTrue('UNAUTHORIZED', true)
        }
    }

    if (error.response.status === 401 && originalRequest._retry) {
        globalBooleanActions.setTrue('UNAUTHORIZED', true)
    }

    return Promise.reject(error)
})

axiosInstancePlugin.interceptors.response.use(undefined, async function (error) {
    const originalRequest = error.config

    if (error.response.status === 401 && !originalRequest._retry) {
        const authData = await electron((methods) => methods.ipcRenderer.invoke('GET_AUTH_PLUGIN_DATA'))

        if (authData?.type === 'OAuth2') {
            originalRequest._retry = true

            await axiosInstancePlugin.post('/refresh-token/plugin')

            return axiosInstancePlugin(originalRequest)
        } else {
            globalBooleanActions.setTrue('UNAUTHORIZED PLUGIN')
        }
    }

    if (error.response.status === 401 && originalRequest._retry) {
        globalBooleanActions.setTrue('UNAUTHORIZED PLUGIN')
    }

    return Promise.reject(error)
})
