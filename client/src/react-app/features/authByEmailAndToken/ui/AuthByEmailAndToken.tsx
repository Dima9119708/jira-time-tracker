import { Button, PasswordInput, TextInput } from '@mantine/core'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { BaseAuthFormFields } from '../types'
import { useMutation } from '@tanstack/react-query'
import { axiosInstance } from '../../../shared/config/api/api'

const AuthByEmailAndToken = () => {
    const navigate = useNavigate()

    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm<BaseAuthFormFields>({
        values: {
            host: process.env.SERVER_URL!,
            email: process.env.EMAIL!,
            apiToken: process.env.API_TOKEN!,
        },
    })

    const { isPending, mutate } = useMutation({
        mutationFn: (variables: BaseAuthFormFields) => axiosInstance.post('/login', variables),
        onSuccess: () => navigate('/projects'),
    })

    const onSubmit: SubmitHandler<BaseAuthFormFields> = (formValues) => mutate(formValues)

    return (
        <>
            <TextInput
                {...register('host')}
                label="Server URL"
                placeholder="https://your-domain.atlassian.net/"
                error={errors.host?.message}
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
