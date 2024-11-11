import { Assignee } from 'react-app/shared/types/Jira/Issues'
import { User } from 'react-app/shared/types/Jira/UserSearch'

export const isActiveUser = (user: Assignee | User) => {
    return user.accountType !== 'app' && user.active
}
