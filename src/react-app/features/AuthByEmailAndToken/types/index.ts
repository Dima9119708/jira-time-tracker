export interface BaseAuthFormFields {
    jiraSubDomain: string
    email: string
    apiToken: string
    remember: boolean
}

export interface AuthByEmailAndTokenProps {
    onSubmit: (formValues: BaseAuthFormFields) => void
}
