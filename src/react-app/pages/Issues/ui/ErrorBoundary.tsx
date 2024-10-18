import { useRouteError } from 'react-router-dom'
import { AxiosError } from 'axios'
import { ErrorType } from '../../../shared/types/jiraTypes'
import SectionMessage from '@atlaskit/section-message'

const ErrorBoundary = () => {
    const error = useRouteError() as AxiosError<ErrorType>

    return (
        <SectionMessage
            title="An error occurred within the application"
            appearance="error"
        >
            {error.response?.data?.errorMessages?.join(', ') ?? JSON.stringify(error.response?.data)}
        </SectionMessage>
    )
}

export default ErrorBoundary
