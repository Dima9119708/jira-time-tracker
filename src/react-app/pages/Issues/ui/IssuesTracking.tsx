import { useQuery } from '@tanstack/react-query'
import { queryGetIssuesTracking } from '../model/queryOptions'
import TaskTracking from './IssueTracking'
import { useNotifications } from 'react-app/shared/lib/hooks/useNotifications'

const IssuesTracking = () => {
    const notify = useNotifications()

    const { data } = useQuery(
        queryGetIssuesTracking({
            onReject: (reject) => {
                notify.error({
                    title: `Issue ${reject.config?.params.id}`,
                    description: reject.response?.data.errorMessages.join(', '),
                })
            },
        })
    )

    return (
        <>
            {data?.map((task, idxIssue) => (
                <TaskTracking
                    key={task.id}
                    issueKey={task.key}
                    idxIssue={idxIssue}
                    fields={task.fields}
                    id={task.id}
                />
            ))}
        </>
    )
}

export default IssuesTracking
