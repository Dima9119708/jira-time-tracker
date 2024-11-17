import IssueTracking from './IssueTracking'
import { useNotifications } from 'react-app/shared/lib/hooks/useNotifications'
import { useIssuesTrackingGET } from 'react-app/entities/Issues'
import { useErrorNotifier } from 'react-app/shared/lib/hooks/useErrorNotifier'

const IssuesTracking = () => {
    const notify = useNotifications()

    const { data, error } = useIssuesTrackingGET({
        onReject: (reject) => {
            notify.error({
                title: `Issue ${reject.config?.params.id}`,
                description: reject.response?.data.errorMessages.join(', '),
            })
        },
    })

    useErrorNotifier(error)

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
