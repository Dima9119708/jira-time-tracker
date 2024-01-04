import { useRouteError } from 'react-router-dom'
import { AxiosError } from 'axios'
import { ErrorType } from '../../../shared/types/jiraTypes'
import { Alert } from '@mantine/core'
import { IconInfoCircle } from '@tabler/icons-react'

const ErrorBoundary = () => {
    const error = useRouteError() as AxiosError<ErrorType>

    return (
        <div className="h-[100%] flex items-center justify-center">
            <Alert
                variant="light"
                color="red"
                title={`Status error - ${error.response?.status}`}
                icon={<IconInfoCircle />}
            >
                {error.response?.data?.errorMessages?.join(', ') ?? JSON.stringify(error.response?.data)}
            </Alert>
        </div>
    )
}

export default ErrorBoundary
