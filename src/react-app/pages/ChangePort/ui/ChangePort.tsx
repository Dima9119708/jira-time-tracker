import { SubmitHandler, useForm } from 'react-hook-form'
import { electron } from '../../../shared/lib/electron/electron'
import { useEffect, useState } from 'react'
import { Box, Flex, Text, xcss } from '@atlaskit/primitives'
import Heading from '@atlaskit/heading'
import SectionMessage from '@atlaskit/section-message'
import Textfield from '@atlaskit/textfield'
import { ErrorMessage } from '@atlaskit/form'
import Button from '@atlaskit/button/new'
import { TOP_PANEL_HEIGHT } from 'react-app/widgets/TopPanel/ui/TopPanel'

interface FormValues {
    post: number
}

const styles = {
    wrap: xcss({
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: `calc(100vh - ${TOP_PANEL_HEIGHT})`,
    }),
    inner: xcss({
        display: 'grid',
        gap: 'space.150',
        padding: 'space.200',
        borderRadius: 'border.radius.200',
        boxShadow: 'elevation.shadow.overflow',
    }),
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
        const unsubscribe = electron((methods) => {
            const onChangePortLoading = (_: Electron.IpcRendererEvent, isLoading: boolean) => {
                setLoading(isLoading)
            }
            const onChangePortError = (_: Electron.IpcRendererEvent, errorMessage: string) => {
                setError(errorMessage)
            }

            methods.ipcRenderer.on('CHANGE-PORT-LOADING', onChangePortLoading)

            methods.ipcRenderer.on('CHANGE-PORT-ERROR', onChangePortError)

            return () => {
                methods.ipcRenderer.removeListener('CHANGE-PORT-LOADING', onChangePortLoading)
                methods.ipcRenderer.removeListener('CHANGE-PORT-ERROR', onChangePortError)
            }
        })

        return () => {
            unsubscribe()
        }
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
        <Box xcss={styles.wrap}>
            <Box xcss={styles.inner}>
                <Heading size="xlarge">Change port</Heading>

                {!!error && (
                    <SectionMessage
                        title="Error"
                        appearance="error"
                    >
                        {error}
                    </SectionMessage>
                )}

                <SectionMessage
                    title="Error"
                    appearance="error"
                >
                    {error}
                </SectionMessage>

                <Flex
                    alignItems="center"
                    columnGap="space.100"
                >
                    <Text
                        size="large"
                        weight="bold"
                    >
                        Set the port from 1025 to 65535
                    </Text>

                    <Box>
                        <Textfield
                            type="number"
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
                            min={1025}
                            max={65535}
                        />
                        {errors.post?.message && <ErrorMessage>{errors.post?.message}</ErrorMessage>}
                    </Box>
                </Flex>

                <Flex
                    columnGap="space.100"
                    justifyContent="end"
                >
                    <Button onClick={onCancel}>Cancel</Button>
                    <Button
                        isLoading={loading}
                        appearance="primary"
                        onClick={handleSubmit(onSubmit)}
                    >
                        Save
                    </Button>
                </Flex>
            </Box>
        </Box>
    )
}

export default ChangePort
