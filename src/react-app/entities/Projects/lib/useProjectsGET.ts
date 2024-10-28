import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from 'react-app/shared/config/api/api'

interface ProjectsResponse {
    values: Project[]
}

export interface Project {
    id: string
    avatarUrls: {
        '16x16': string
        '24x24': string
        '32x32': string
        '48x48': string
    }
    name: string
    key: string
}

export const useProjectsGET = ({ opened }: { opened: boolean }) => {
    const query = useQuery({
        queryKey: ['projects'],
        queryFn: () => axiosInstance.get<ProjectsResponse>('/projects'),
        select: (data) => data.data,
        enabled: opened,
    })
    return query
}
