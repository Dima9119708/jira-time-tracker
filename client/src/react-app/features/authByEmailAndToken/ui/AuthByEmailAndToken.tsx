import { Button, PasswordInput, TextInput } from '@mantine/core'
import { useForm } from 'react-hook-form'
import { AuthByEmailAndTokenProps, BaseAuthFormFields } from '../types'

const AuthByEmailAndToken = (props: AuthByEmailAndTokenProps) => {
    const { onSubmit } = props
    const methods = useForm<BaseAuthFormFields>()

    const {
        register,
        formState: { errors },
    } = methods

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
                onClick={methods.handleSubmit(onSubmit)}
                fullWidth
            >
                Sign in
            </Button>
        </>
    )
}

export default AuthByEmailAndToken
