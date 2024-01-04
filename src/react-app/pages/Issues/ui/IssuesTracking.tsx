import { useQuery } from '@tanstack/react-query'
import { queryGetIssuesTracking } from '../model/queryOptions'
import { useSearchParams } from 'react-router-dom'
import TaskTracking from './IssueTracking'

const IssuesTracking = () => {
    const { data } = useQuery(queryGetIssuesTracking())

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
