import { IssueLink } from 'react-app/shared/types/Jira/Issues'

export const isInwardIssue = (issuelink: IssueLink) => 'inwardIssue' in issuelink
