import { Button, PasswordInput, TextInput } from '@mantine/core'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { BaseAuthFormFields } from '../types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '../../../shared/config/api/api'

const AuthByEmailAndToken = () => {
    const navigate = useNavigate()

    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm<BaseAuthFormFields>({
        values: {
            jiraSubDomain: process.env.SERVER_URL!,
            email: process.env.EMAIL!,
            apiToken: process.env.API_TOKEN!,
        },
    })

    const queryClient = useQueryClient()

    const { isPending, mutate } = useMutation({
        mutationFn: (variables: { jiraSubDomain: string; encodedAuth: string }) => {
            return axiosInstance.post('/login', {
                encodedauth: variables.encodedAuth,
                jirasubdomain: variables.jiraSubDomain,
            })
        },
        onSuccess: (data, variables) => {
            localStorage.setItem('encodedAuth', variables.encodedAuth)
            localStorage.setItem('jiraSubDomain', variables.jiraSubDomain)

            queryClient.setQueryData(['login'], true)
            navigate('/filters')
        },
    })

    const onSubmit: SubmitHandler<BaseAuthFormFields> = (formValues) => {
        const encodedAuth = Buffer.from(`${formValues.email}:${formValues.apiToken}`).toString('base64')

        mutate({
            jiraSubDomain: formValues.jiraSubDomain,
            encodedAuth,
        })
    }

    return (
        <>
            <TextInput
                {...register('jiraSubDomain')}
                label="Server URL"
                placeholder="https://your-domain.atlassian.net/"
                error={errors.jiraSubDomain?.message}
                required
                mb="xs"
            />
            <TextInput
                {...register('email')}
                label="Email"
                placeholder="Email"
                error={errors.email?.message}
                required
                mb="xs"
            />
            <PasswordInput
                {...register('apiToken')}
                label="API token"
                placeholder="Your API token"
                error={errors.apiToken?.message}
                required
                mb="lg"
            />

            <Button
                loading={isPending}
                onClick={handleSubmit(onSubmit)}
                fullWidth
            >
                Sign in
            </Button>
        </>
    )
}

export default AuthByEmailAndToken
