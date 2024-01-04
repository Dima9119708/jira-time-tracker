import { Button, Group, Input, Modal, rem, Select, Text } from '@mantine/core'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import dayjs from 'dayjs'
import { useMutation } from '@tanstack/react-query'
import { AxiosError, AxiosResponse } from 'axios'
import { FilterDetails } from '../../../pages/Issues/types/types'
import { ErrorType } from '../../../shared/types/jiraTypes'
import { axiosInstance } from '../../../shared/config/api/api'
import { UseGlobalState, useGlobalState } from '../../../shared/lib/hooks/useGlobalState'
import { notifications } from '@mantine/notifications'
import { NOTIFICATION_AUTO_CLOSE, NOTIFICATION_VARIANT } from '../../../shared/const/notifications'
import { IconCheck } from '@tabler/icons-react'

interface FormValues {
    timeLoggingIntervalUnit: UseGlobalState['settings']['timeLoggingIntervalUnit']
    timeLoggingIntervalValue: UseGlobalState['settings']['timeLoggingIntervalValue']
}

const Settings = () => {
    const opened = useGlobalState((state) => state.openSettings)

    const { control, handleSubmit } = useForm<FormValues>({
        mode: 'onBlur',
        defaultValues: useGlobalState.getState().settings,
    })

    const { mutate, isPending } = useMutation<
        AxiosResponse<FilterDetails>,
        AxiosError<ErrorType>,
        string,
        { notificationId: string; title: string }
    >({
        mutationFn: (variables) =>
            axiosInstance.put<FilterDetails>(
                '/filter-details',
                {
                    description: variables,
                },
                {
                    params: {
                        id: useGlobalState.getState().filterId,
                    },
                }
            ),
        onMutate: () => {
            const title = 'Update settings'

            const id = notifications.show({
                title: title,
                message: '',
                loading: true,
            })

            return {
                notificationId: id,
                title,
            }
        },
        onSuccess: (data, variables, context) => {
            notifications.update({
                id: context!.notificationId,
                autoClose: NOTIFICATION_AUTO_CLOSE,
                loading: false,
                icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
                title: context!.title,
                message: '',
            })

            useGlobalState.getState().onCloseSettings()
        },
        onError: (error) => {
            notifications.show({
                title: `Error loading issue`,
                message: error.response?.data.errorMessages.join(', '),
                ...NOTIFICATION_VARIANT.ERROR,
            })
        },
    })

    const onSave: SubmitHandler<FormValues> = (data, event) => {
        let millisecond
        let second

        if (data.timeLoggingIntervalUnit === 'minutes') {
            millisecond = dayjs.duration(data.timeLoggingIntervalValue, 'minutes').asMilliseconds()
            second = dayjs.duration(data.timeLoggingIntervalValue, 'minutes').asSeconds()
        }
        if (data.timeLoggingIntervalUnit === 'hours') {
            millisecond = dayjs.duration(data.timeLoggingIntervalValue, 'hours').asMilliseconds()
            second = dayjs.duration(data.timeLoggingIntervalValue, 'hours').asSeconds()
        }

        const newSettings = {
            timeLoggingIntervalUnit: data.timeLoggingIntervalUnit,
            timeLoggingIntervalValue: data.timeLoggingIntervalValue,
            timeLoggingIntervalSecond: second!,
            timeLoggingIntervalMillisecond: millisecond!,
        }

        useGlobalState.getState().setSettings(newSettings)
        mutate(JSON.stringify(newSettings))
    }

    return (
        <Modal
            opened={opened}
            onClose={useGlobalState.getState().onCloseSettings}
            centered
            title={
                <Text
                    size="xl"
                    fw="bold"
                >
                    Settings
                </Text>
            }
            transitionProps={{ transition: 'fade', duration: 200 }}
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
            }}
        >
            <Group
                justify="space-between"
                wrap="nowrap"
            >
                <Text size="sm">Time logging interval</Text>

                <Group>
                    <Controller
                        name="timeLoggingIntervalValue"
                        control={control}
                        rules={{ required: 'Required' }}
                        render={({ field, fieldState }) => {
                            console.log('fieldState.error =>', fieldState.error)
                            return (
                                <Input
                                    value={field.value}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    w={60}
                                    type="number"
                                    error={fieldState.error?.message}
                                />
                            )
                        }}
                    />

                    <Controller
                        name="timeLoggingIntervalUnit"
                        control={control}
                        render={({ field, fieldState }) => {
                            return (
                                <Select
                                    value={field.value}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    w={100}
                                    placeholder="Unit"
                                    data={[
                                        { label: 'Minute', value: 'minutes' },
                                        { label: 'Hour', value: 'hours' },
                                    ]}
                                    error={fieldState.error?.message}
                                />
                            )
                        }}
                    />
                </Group>
            </Group>

            <Group
                mt={20}
                justify="end"
            >
                <Button
                    onClick={useGlobalState.getState().onCloseSettings}
                    color="gray"
                >
                    Cancel
                </Button>
                <Button
                    disabled={isPending}
                    onClick={handleSubmit(onSave)}
                >
                    Save
                </Button>
            </Group>
        </Modal>
    )
}

export default Settings
