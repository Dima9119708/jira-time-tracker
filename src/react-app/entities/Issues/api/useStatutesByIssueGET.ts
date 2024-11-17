import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from 'react-app/shared/config/api/api'
import { Issue, TransitionsResponse } from 'react-app/shared/types/Jira/Issues'

export const useStatutesByIssueGET = ({ issueId, open }: { issueId: Issue['id']; open: boolean }) => {
    return useQuery({
        queryKey: ['statuses task', issueId],
        queryFn: () => axiosInstance.get<TransitionsResponse>('/statuses-task', { params: { id: issueId } }),
        select: (data) => data.data,
        enabled: open,
    })
}
