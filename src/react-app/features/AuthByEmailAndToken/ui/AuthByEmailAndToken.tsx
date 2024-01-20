import { Button, Checkbox, PasswordInput, TextInput, Text, Group } from '@mantine/core'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { BaseAuthFormFields } from '../types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '../../../shared/config/api/api'
import { electron } from '../../../shared/lib/electron/electron'
import { IconHelp } from '@tabler/icons-react'
import ModalHelp from './ModalHelp'
import { useHelpModal } from '../lib/useHelpModal'

const AuthByEmailAndToken = () => {
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const {
        handleSubmit,
        register,
        getValues,
        formState: { errors },
    } = useForm<BaseAuthFormFields>({
        defaultValues: async () => {
            const data: BaseAuthFormFields = await electron((methods) => methods.ipcRenderer.invoke('GET_REMEMBER_DATA_BASIC_AUTH'))

            if (data) {
                return data
            }

            return {
                email: '',
                apiToken: '',
                remember: true,
                jiraSubDomain: '',
            }
        },
    })

    const { isPending, mutate } = useMutation({
        mutationFn: async (variables: BaseAuthFormFields) => {
            await electron(async ({ ipcRenderer }) => {
                if (variables.remember) {
                    await ipcRenderer.invoke('SAVE_REMEMBER_DATA_BASIC_AUTH', {
                        ...variables,
                        apiToken: getValues('apiToken'),
                    })
                } else {
                    await ipcRenderer.invoke('DELETE_REMEMBER_DATA_BASIC_AUTH')
                }

                return ipcRenderer.invoke('SAVE_DATA_BASIC_AUTH', variables)
            })

            return axiosInstance.get('/login')
        },
        onSuccess: (data) => {
            queryClient.setQueryData(['login'], data)
            navigate('/issues')
        },
    })

    const onSubmit: SubmitHandler<BaseAuthFormFields> = (formValues) => {
        const apiToken = Buffer.from(`${formValues.email}:${formValues.apiToken}`).toString('base64')

        mutate({
            ...formValues,
            apiToken,
        })
    }

    return (
        <>
            <TextInput
                {...register('jiraSubDomain')}
                label="Server URL"
                rightSection={
                    <IconHelp
                        className="cursor-pointer"
                        onClick={() => useHelpModal.getState().onOpen('your-domain')}
                    />
                }
                placeholder="https://your-domain.atlassian.net/"
                error={errors.jiraSubDomain?.message}
                required
                mb="xs"
            />
            <TextInput
                {...register('email')}
                rightSection={
                    <IconHelp
                        className="cursor-pointer"
                        onClick={() => useHelpModal.getState().onOpen('email')}
                    />
                }
                label="Email"
                placeholder="Email"
                error={errors.email?.message}
                required
                mb="xs"
            />
            <PasswordInput
                {...register('apiToken')}
                rightSection={
                    <IconHelp
                        className="cursor-pointer"
                        onClick={() => useHelpModal.getState().onOpen('apiToken')}
                    />
                }
                label="API token"
                placeholder="Your API token"
                error={errors.apiToken?.message}
                required
                mb="xs"
            />

            <Checkbox
                {...register('remember')}
                label="Remember"
                mb="lg"
            />

            <Button
                loading={isPending}
                onClick={handleSubmit(onSubmit)}
                fullWidth
            >
                Sign in
            </Button>

            <ModalHelp />
        </>
    )
}

export default AuthByEmailAndToken
