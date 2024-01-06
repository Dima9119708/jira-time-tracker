import { Button, Divider, Group, Input, Modal, rem, Select, Switch, Text } from '@mantine/core'
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

export type FormValues = UseGlobalState['settings']

const Settings = () => {
    const opened = useGlobalState((state) => state.openSettings)

    const { control, handleSubmit, watch } = useForm<FormValues>({
        mode: 'onBlur',
        defaultValues: useGlobalState.getState().settings,
    })

    const sendInactiveNotificationEnabled = !watch('sendInactiveNotification.enabled')
    const systemIdleEnabled = !watch('systemIdle.enabled')

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

    const onSave: SubmitHandler<FormValues> = (data) => {
        const newSettings: UseGlobalState['settings'] = {
            timeLoggingInterval: {
                unit: data.timeLoggingInterval.unit,
                displayTime: data.timeLoggingInterval.displayTime,
                second:
                    data.timeLoggingInterval.unit === 'minutes'
                        ? dayjs.duration(data.timeLoggingInterval.displayTime, 'minutes').asSeconds()
                        : dayjs.duration(data.timeLoggingInterval.displayTime, 'hours').asSeconds(),
            },
            sendInactiveNotification: {
                unit: data.sendInactiveNotification.unit,
                displayTime: data.sendInactiveNotification.displayTime,
                enabled: data.sendInactiveNotification.enabled,
                millisecond:
                    data.sendInactiveNotification.unit === 'minutes'
                        ? dayjs.duration(data.sendInactiveNotification.displayTime, 'minutes').asMilliseconds()
                        : dayjs.duration(data.sendInactiveNotification.displayTime, 'hours').asMilliseconds(),
            },
            systemIdle: {
                unit: data.systemIdle.unit,
                displayTime: data.systemIdle.displayTime,
                enabled: data.systemIdle.enabled,
                second:
                    data.systemIdle.unit === 'minutes'
                        ? dayjs.duration(data.systemIdle.displayTime, 'minutes').asSeconds()
                        : dayjs.duration(data.systemIdle.displayTime, 'hours').asSeconds(),
            },
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
                        name="timeLoggingInterval.displayTime"
                        control={control}
                        rules={{ required: 'Required' }}
                        render={({ field, fieldState }) => {
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
                        name="timeLoggingInterval.unit"
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

            <Divider
                mt={20}
                mb={20}
            />

            <Group
                justify="space-between"
                wrap="nowrap"
            >
                <Text size="sm">
                    Should send a notification when the application is open but not in use, and none of the tasks have been taken into work.
                </Text>

                <Group wrap="nowrap">
                    <Controller
                        name="sendInactiveNotification.enabled"
                        control={control}
                        render={({ field }) => {
                            return (
                                <Switch
                                    checked={field.value}
                                    onChange={field.onChange}
                                    size="xs"
                                />
                            )
                        }}
                    />

                    <Controller
                        name="sendInactiveNotification.displayTime"
                        control={control}
                        rules={{ required: 'Required' }}
                        render={({ field, fieldState }) => {
                            return (
                                <Input
                                    value={field.value}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    w={60}
                                    type="number"
                                    error={fieldState.error?.message}
                                    disabled={sendInactiveNotificationEnabled}
                                />
                            )
                        }}
                    />

                    <Controller
                        name="sendInactiveNotification.unit"
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
                                    disabled={sendInactiveNotificationEnabled}
                                />
                            )
                        }}
                    />
                </Group>
            </Group>

            <Divider
                mt={20}
                mb={20}
            />

            <Group
                justify="space-between"
                wrap="nowrap"
            >
                <Text size="sm">To stop logging the time when the system is in a waiting state.</Text>
                <Group wrap="nowrap">
                    <Controller
                        name="systemIdle.enabled"
                        control={control}
                        render={({ field }) => {
                            return (
                                <Switch
                                    checked={field.value}
                                    onChange={field.onChange}
                                    size="xs"
                                />
                            )
                        }}
                    />

                    <Controller
                        name="systemIdle.displayTime"
                        control={control}
                        rules={{ required: 'Required' }}
                        render={({ field, fieldState }) => {
                            return (
                                <Input
                                    value={field.value}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    w={60}
                                    type="number"
                                    error={fieldState.error?.message}
                                    disabled={systemIdleEnabled}
                                />
                            )
                        }}
                    />

                    <Controller
                        name="systemIdle.unit"
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
                                    disabled={systemIdleEnabled}
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
