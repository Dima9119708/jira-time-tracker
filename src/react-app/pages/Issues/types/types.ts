import { Issue, IssueResponse } from 'react-app/shared/types/Jira/Issues'

export interface IssueProps {
    id: IssueResponse['issues'][number]['id']
    issueKey: IssueResponse['issues'][number]['key']
    fields: Issue['fields']

    idxPage?: number
    idxIssue: number

    isLast: boolean
}
