export interface BaseAuthFormFields {
    host: string
    email: string
    apiToken: string
}

export interface AuthByEmailAndTokenProps {
    onSubmit: (formValues: BaseAuthFormFields) => void
}
