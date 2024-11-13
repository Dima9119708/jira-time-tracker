import { FunctionComponent, useEffect } from 'react'
import { useLogTimeAutoBase } from '../api/useLogTimeAutoBase'
import { Issue } from 'react-app/shared/types/Jira/Issues'

export interface LogTimeAutoBaseProps {
    issueId: Issue['id'],
    onSuccess?: () => void
    children: FunctionComponent<ReturnType<typeof useLogTimeAutoBase>>,
}

const LogTimeAutoBase = (props: LogTimeAutoBaseProps) => {
    const { onSuccess } = props
    const { onLogTime, isLoading, isMutationSuccess } = useLogTimeAutoBase(props.issueId)

    useEffect(() => {
        if (isMutationSuccess) {
            onSuccess?.()
        }
    }, [onSuccess, isMutationSuccess])

    return props.children({ onLogTime, isLoading, isMutationSuccess });
};

export default LogTimeAutoBase;
