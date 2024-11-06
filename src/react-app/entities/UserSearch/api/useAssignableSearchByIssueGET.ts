import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from 'react-app/shared/config/api/api'
import { Assignee, Issue } from 'react-app/shared/types/Jira/Issues'
import { UNASSIGNED_USER } from '../constants/defaultUser'

export const useAssignableSearchByIssueGET = ({ issueKey, open }: { issueKey: Issue['key']; open: boolean }) => {
    return useQuery({
        queryKey: ['assignable issue', issueKey],
        queryFn: () => axiosInstance.get<Assignee[]>('/issue-assignable', { params: { issueKey: issueKey } }),
        select: (response) => {
            return [
                ...response.data,
                UNASSIGNED_USER
            ].sort((a, b) => a.displayName.localeCompare(b.displayName))
        },
        enabled: open,
    })
}
