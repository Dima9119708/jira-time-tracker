import { Button, PasswordInput, TextInput } from '@mantine/core'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { BaseAuthFormFields } from '../types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '../../../shared/config/api/api'
import { electron } from '../../../shared/lib/electron/electron'

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
        mutationFn: async (variables: { jiraSubDomain: string; encodedAuth: string }) => {
            await electron(({ ipcRenderer }) => {
                return ipcRenderer.invoke('POST_BASIC_AUTH', { apiToken: variables.encodedAuth, jiraSubDomain: variables.jiraSubDomain })
            })

            return axiosInstance.get('/login')
        },
        onSuccess: (data) => {
            queryClient.setQueryData(['login'], data)
            navigate('/issues')
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
