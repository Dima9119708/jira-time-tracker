export interface BaseAuthFormFields {
    jiraSubDomain: string
    email: string
    apiToken: string
}

export interface AuthByEmailAndTokenProps {
    onSubmit: (formValues: BaseAuthFormFields) => void
}
