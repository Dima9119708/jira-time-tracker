import { useForm, SubmitHandler } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { BaseAuthFormFields } from '../types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '../../../shared/config/api/api'
import { electron } from '../../../shared/lib/electron/electron'
import ModalHelp from './ModalHelp'
import { useHelpModal } from '../lib/useHelpModal'
import { Box, Stack, xcss } from '@atlaskit/primitives'
import { Field } from '@atlaskit/form'
import { Checkbox } from '@atlaskit/checkbox'
import Textfield from '@atlaskit/textfield'
import QuestionCircleIcon from '@atlaskit/icon/glyph/question-circle'
import Button from '@atlaskit/button/new'

const styles = {
    wrap: xcss({
        width: '100%',
    }),
    checkbox_wrap: xcss({
        marginTop: 'space.050',
    }),
}

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

            return axiosInstance.get('/myself')
        },
        onSuccess: (data) => {
            queryClient.setQueryData(['myself'], data)
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
        <Box xcss={styles.wrap}>
            <Field
                label="Server URL"
                isRequired
                name="jiraSubDomain"
            >
                {() => (
                    <Textfield
                        placeholder="https://your-domain.atlassian.net/"
                        {...register('jiraSubDomain')}
                        elemAfterInput={
                            <div onClick={() => useHelpModal.getState().onOpen('your-domain')}>
                                <QuestionCircleIcon label="help" />
                            </div>
                        }
                    />
                )}
            </Field>

            <Field
                label="Email"
                isRequired
                name="email"
            >
                {() => (
                    <Textfield
                        placeholder="Email"
                        {...register('email')}
                        elemAfterInput={
                            <div onClick={() => useHelpModal.getState().onOpen('email')}>
                                <QuestionCircleIcon label="help" />
                            </div>
                        }
                    />
                )}
            </Field>

            <Field
                label="API token"
                isRequired
                name="apiToken"
            >
                {() => (
                    <Textfield
                        placeholder="Your API token"
                        {...register('apiToken')}
                        elemAfterInput={
                            <div onClick={() => useHelpModal.getState().onOpen('apiToken')}>
                                <QuestionCircleIcon label="help" />
                            </div>
                        }
                    />
                )}
            </Field>

            <Stack space="space.200">
                <Box xcss={styles.checkbox_wrap}>
                    <Checkbox
                        {...register('remember')}
                        label="Remember"
                        name="remember"
                    />
                </Box>

                <Button
                    appearance="primary"
                    isLoading={isPending}
                    onClick={handleSubmit(onSubmit)}
                    shouldFitContainer
                >
                    Sign in
                </Button>
            </Stack>

            <ModalHelp />
        </Box>
    )
}

export default AuthByEmailAndToken
