export interface StatusesTaskResponse {
    transitions: Array<{
        name: string
        id: string
    }>
}

export type TStatusTask = StatusesTaskResponse['transitions'][number]

export interface StatusesTaskProps {
    id: string
    value: string
    onChange: (status: StatusesTaskResponse['transitions'][number]) => void
}
