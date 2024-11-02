import { useQuery } from '@tanstack/react-query'
import IssueTracking from './IssueTracking'
import { useNotifications } from 'react-app/shared/lib/hooks/useNotifications'
import { queryGetIssuesTracking } from 'react-app/entities/Issues'

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

    return data?.map((task) => (
        <IssueTracking
            key={task.id}
            issueKey={task.key}
            fields={task.fields}
            id={task.id}
        />
    ))
}

export default IssuesTracking
