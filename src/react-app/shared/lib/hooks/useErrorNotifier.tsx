import { useEffect, useCallback } from 'react'
import { useNotifications } from './useNotifications'
import axios from 'axios'

const ERROR_PATHS: (string | string[])[] = [
    'response.data.errorMessages', // { response: { data: { errorMessages: [] } } }
    ['response.data.errors', 'message'], // { response: { data: { errors: [ { message: 'Error } ] } } }
]

const HTTP_ERROR_MESSAGES: Record<number, string> = {
    400: 'Bad Request — The request could not be understood or was missing required parameters.',
    401: 'Unauthorized — Authentication failed or user does not have permissions for the requested operation.',
    403: 'Forbidden — Access is denied.',
    404: 'Not Found — The requested resource could not be found.',
    500: 'Internal Server Error — An unexpected error occurred on the server.',
    502: 'Bad Gateway — The server received an invalid response from the upstream server.',
    503: 'Service Unavailable — The server is temporarily unable to handle the request.',
    504: 'Gateway Timeout — The server did not receive a timely response from the upstream server.',
};

const isDateObject = (value: unknown): value is Date => value instanceof Date
const isObjectType = (value: unknown): value is object => typeof value === 'object'
const compact = <TValue,>(value: TValue[]) => (Array.isArray(value) ? value.filter(Boolean) : [])
const isUndefined = (value: unknown): value is null | undefined => value == null
const isObject = <T extends object>(value: unknown): value is T =>
    !isNullOrUndefined(value) && !Array.isArray(value) && isObjectType(value) && !isDateObject(value)
const isNullOrUndefined = (value: unknown): value is null | undefined => value == null

const get = <T,>(object: T, path?: string | null, defaultValue?: unknown): any => {
    if (!path || !isObject(object)) {
        return defaultValue
    }

    const result = compact(path.split(/[,[\].]+?/)).reduce(
        (result: any, key: any) => (isNullOrUndefined(result) ? result : result[key as keyof {}]),
        object
    )

    return isUndefined(result) || result === object
        ? isUndefined(object[path as keyof T])
            ? defaultValue
            : object[path as keyof T]
        : result
}

export const useErrorNotifier = (initialError: unknown = null) => {
    const notify = useNotifications()

    const getMessages = (error: unknown): string[] => {
        const messages: string[] = []

        for (const path of ERROR_PATHS) {
            if (Array.isArray(path)) {
                const nestedPaths: string[] = []

                for (const p of path) {
                    const element = get(error, p)

                    if (Array.isArray(element)) {
                        for (let i = 0; i < element.length; i++) {
                            nestedPaths.push(`${p}.[${i}]`)
                        }
                        continue
                    }

                    if (nestedPaths.length > 0) {
                        const newPathsNestedPaths = []

                        for (const np of nestedPaths) {
                            const errorMessages = get(error, `${np}.${p}`)

                            newPathsNestedPaths.push(`${np}.${p}`)

                            if (typeof errorMessages === 'string') {
                                if (Array.isArray(errorMessages)) {
                                    messages.push(...errorMessages)
                                } else {
                                    messages.push(errorMessages)
                                }
                            }
                        }
                        nestedPaths.length = 0
                        nestedPaths.push(...newPathsNestedPaths)
                    }
                }
            } else {
                const errorMessages = get(error, path)

                if (typeof errorMessages === 'string') {
                    if (Array.isArray(errorMessages)) {
                        messages.push(...errorMessages)
                    } else {
                        messages.push(errorMessages)
                    }
                }
            }
        }

        if (messages.length === 0 && typeof error === 'object' && error !== null) {
            const status = get(error, 'response.status') as number | undefined;

            if (status && HTTP_ERROR_MESSAGES[status]) {
                messages.push(HTTP_ERROR_MESSAGES[status]);
            } else {
                messages.push('An unknown error occurred.');
            }
        }

        return messages
    }

    const handleAxiosError = useCallback(
        (error: unknown) => {
            if (axios.isAxiosError(error)) {
                const errorMessages = getMessages(error)

                if (errorMessages.length > 1) {
                    notify.error({
                        title: 'Request Error',
                        description: (
                            <div>
                                {errorMessages.map((msg, index) => (
                                    <div key={index}>{msg}</div>
                                ))}
                            </div>
                        ),
                    })
                } else if (errorMessages.length === 1) {
                    notify.error({
                        title: errorMessages[0],
                    })
                } else {
                    notify.error({
                        title: 'Unknown Error',
                    })
                }
            }
        },
        [notify]
    )

    useEffect(() => {
        if (initialError) {
            handleAxiosError(initialError)
        }
    }, [initialError, handleAxiosError])

    return handleAxiosError
}
