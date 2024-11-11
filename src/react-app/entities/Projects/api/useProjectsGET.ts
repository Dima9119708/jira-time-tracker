import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from 'react-app/shared/config/api/api'
import { Project } from 'react-app/shared/types/Jira/Issues'

interface ProjectsResponse {
    values: Project[]
}

export const useProjectsGET = ({ opened }: { opened: boolean }) => {
    const query = useQuery({
        queryKey: ['projects'],
        queryFn: (context) => axiosInstance.get<ProjectsResponse>('/projects', {
            signal: context.signal
        }),
        select: (data) => data.data,
        enabled: opened,
    })
    return query
}
