import { Assignee, Issue } from 'react-app/shared/types/Jira/Issues'
import { AvatarUrls } from 'react-app/shared/types/Jira/CommonTypes'

interface IssueFields extends Pick<Issue['fields'], 'summary' | 'issuetype' | 'priority' | 'status' | 'assignee' >{}

export interface RelatedIssuesQuery {
    id: Issue['id']
    issueKey: Issue['id']
    isRelatedIssuesLoad: boolean
    parentIssue: {
        key: Issue['key']
        summary: Issue['fields']['summary']
    },
    fields: IssueFields
    //
    // parentIssueKey: Issue['key']
    // parentIssueSummary: Issue['fields']['summary']
    // issueKey: Issue['key']
    // issueId: Issue['id']
    // issueSummary: Issue['fields']['summary']
    // priorityName: Issue['fields']['priority']['name']
    // priorityIconUrl: Issue['fields']['priority']['iconUrl']
    // issueTypeIconUrl: Issue['fields']['issuetype']['iconUrl']
    // issueTypeName: Issue['fields']['issuetype']['name']
    // issueAssigneeName: Assignee['displayName']
    // issueAssigneeAvatarUrl: AvatarUrls['16x16']
    // statusCategoryName: Issue['fields']['status']['statusCategory']['name']
    // statusCategoryKey: Issue['fields']['status']['statusCategory']['key']
    // statusId: Issue['fields']['status']['id']
}

export interface RelatedIssuesProps {
    issueId: Issue['id']
}
