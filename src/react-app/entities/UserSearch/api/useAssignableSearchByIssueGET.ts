import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from 'react-app/shared/config/api/api'
import { Assignee, Issue } from 'react-app/shared/types/Jira/Issues'

export const useAssignableSearchByIssueGET = ({ issueKey, open }: { issueKey: Issue['key']; open: boolean }) => {
    return useQuery({
        queryKey: ['assignable issue', issueKey],
        queryFn: () => axiosInstance.get<Assignee[]>('/issue-assignable', { params: { issueKey: issueKey } }),
        select: (response) => {
            return [
                ...response.data,
                {
                    accountId: '',
                    accountType: '',
                    active: false,
                    applicationRoles: {
                        items: [],
                        size: 0,
                    },
                    avatarUrls: {
                        '16x16': '',
                        '24x24': '',
                        '32x32': '',
                        '48x48': '',
                    },
                    displayName: 'Unassigned',
                    emailAddress: '',
                    groups: {
                        items: [],
                        size: 0,
                    },
                    key: '',
                    name: '',
                    self: '',
                    timeZone: '',
                },
            ].sort((a, b) => a.displayName.localeCompare(b.displayName))
        },
        enabled: open,
    })
}
