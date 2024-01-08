import { Alert, Box, Divider, Group, Input, Text, Title } from '@mantine/core'
import { Button } from '@mantine/core'
import { SubmitHandler, useForm } from 'react-hook-form'
import { electron } from '../../../shared/lib/electron/electron'
import { useEffect, useState } from 'react'
import { IconInfoCircle } from '@tabler/icons-react'

interface FormValues {
    post: number
}

const ChangePort = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm<FormValues>({
        mode: 'onBlur',
        defaultValues: {
            post: 44333,
        },
    })

    useEffect(() => {
        electron((methods) => {
            methods.ipcRenderer.on('CHANGE-PORT-LOADING', (_, isLoading) => {
                setLoading(isLoading)
            })

            methods.ipcRenderer.on('CHANGE-PORT-ERROR', (_, errorMessage) => {
                setError(errorMessage)
            })
        })
    }, [])

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        electron((methods) => {
            methods.ipcRenderer.send('CHANGE-PORT-OK', data.post)
        })
    }

    const onCancel = () => {
        electron((methods) => {
            methods.ipcRenderer.send('CHANGE-PORT-CANCEL')
        })
    }

    return (
        <Box p={20}>
            <Title
                order={2}
                mb={10}
            >
                Change port
            </Title>

            <Divider my={10} />

            {!!error && (
                <Alert
                    mb={10}
                    variant="light"
                    color="red"
                    title="Error"
                    icon={<IconInfoCircle />}
                >
                    {error}
                </Alert>
            )}

            <Group
                mb={10}
                wrap="nowrap"
            >
                <Text size="md">Set the port from 1025 to 65535</Text>
                <Input
                    type="number"
                    required
                    {...register('post', {
                        required: 'Required',
                        min: {
                            message: 'Min 1025',
                            value: 1025,
                        },
                        max: {
                            message: 'Max 1025',
                            value: 65535,
                        },
                    })}
                    error={errors.post?.message}
                />
            </Group>

            <Divider my={10} />

            <Group justify="end">
                <Button
                    onClick={onCancel}
                    color="gray"
                >
                    Cancel
                </Button>
                <Button
                    loading={loading}
                    onClick={handleSubmit(onSubmit)}
                >
                    OK
                </Button>
            </Group>
        </Box>
    )
}

export default ChangePort
