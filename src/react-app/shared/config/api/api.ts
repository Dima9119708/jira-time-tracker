import axios from 'axios'
import { electron } from '../../lib/electron/electron'

const PORT = electron((methods) => {
    const url = document.URL

    if (!url.includes('component')) {
        return methods.ipcRenderer.sendSync('PORT') as number
    }
})

export const axiosInstance = axios.create({
    baseURL: `http://localhost:${PORT}`,
    withCredentials: false,
})
