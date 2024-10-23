import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import dayjs from 'dayjs'
import { useMutation } from '@tanstack/react-query'
import { AxiosError, AxiosResponse } from 'axios'
import { FilterDetails } from '../../../pages/Issues/types/types'
import { ErrorType } from '../../../shared/types/jiraTypes'
import { axiosInstance } from '../../../shared/config/api/api'
import { TIME_OPTIONS, UseGlobalState, useGlobalState } from '../../../shared/lib/hooks/useGlobalState'
import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle, ModalTransition } from '@atlaskit/modal-dialog'
import Button, { IconButton } from '@atlaskit/button/new'
import CrossIcon from '@atlaskit/icon/glyph/cross'
import { Flex, xcss, Box } from '@atlaskit/primitives'
import Toggle from '@atlaskit/toggle'
import Textfield from '@atlaskit/textfield'
import Select from '@atlaskit/select'
import Heading from '@atlaskit/heading'
import { useNotifications } from 'react-app/shared/lib/hooks/useNotifications'
import { ErrorMessage } from '@atlaskit/form'
import { useGlobalBoolean } from 'use-global-boolean'

export type FormValues = UseGlobalState['settings']

const styles = {
    divider: xcss({
        paddingBottom: 'space.100',
        marginBottom: 'space.100',
        borderBottomWidth: '5px',
        borderBottomColor: 'color.border.input',
        borderBottomStyle: 'solid',
    }),
    inputWarp: xcss({
        width: '80px',
    }),
    selectWarp: xcss({
        width: '110px',
    }),
    toggleWarp: xcss({
        width: '40px',
    }),
}

const Settings = () => {
    const { watchBoolean, setFalse } = useGlobalBoolean()

    const opened = watchBoolean('user settings')

    const notify = useNotifications()

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
        { dismissFn: Function; title: string }
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

            const dismissFn = notify.loading({
                title: title,
            })

            return {
                dismissFn,
                title,
            }
        },
        onSuccess: (data, variables, context) => {
            context?.dismissFn()

            notify.success({
                title: context!.title,
            })

            setFalse('user settings')
        },
        onError: (error) => {
            notify.error({
                title: `Error loading issue`,
                description: JSON.stringify(error.response?.data),
            })
        },
    })

    const onSave: SubmitHandler<FormValues> = (data) => {
        const newSettings: Partial<UseGlobalState['settings']> = {
            autoStart: data.autoStart,
            timeLoggingInterval: {
                unit: data.timeLoggingInterval.unit,
                displayTime: data.timeLoggingInterval.displayTime,
                second:
                    data.timeLoggingInterval.unit.value === 'minutes'
                        ? dayjs.duration(data.timeLoggingInterval.displayTime, 'minutes').asSeconds()
                        : dayjs.duration(data.timeLoggingInterval.displayTime, 'hours').asSeconds(),
            },
            sendInactiveNotification: {
                unit: data.sendInactiveNotification.unit,
                displayTime: data.sendInactiveNotification.displayTime,
                enabled: data.sendInactiveNotification.enabled,
                millisecond:
                    data.sendInactiveNotification.unit.value === 'minutes'
                        ? dayjs.duration(data.sendInactiveNotification.displayTime, 'minutes').asMilliseconds()
                        : dayjs.duration(data.sendInactiveNotification.displayTime, 'hours').asMilliseconds(),
            },
            systemIdle: {
                unit: data.systemIdle.unit,
                displayTime: data.systemIdle.displayTime,
                enabled: data.systemIdle.enabled,
                second:
                    data.systemIdle.unit.value === 'minutes'
                        ? dayjs.duration(data.systemIdle.displayTime, 'minutes').asSeconds()
                        : dayjs.duration(data.systemIdle.displayTime, 'hours').asSeconds(),
            },
        }

        useGlobalState.getState().setSettings(newSettings)
        mutate(useGlobalState.getState().getSettingsString())
    }

    return (
        <>
            {opened && (
                <Modal onClose={() => setFalse('user settings')}>
                    <ModalHeader>
                        <ModalTitle>Settings</ModalTitle>
                        <IconButton
                            appearance="subtle"
                            icon={CrossIcon}
                            label="Close Modal"
                            onClick={() => setFalse('user settings')}
                        />
                    </ModalHeader>
                    <ModalBody>
                        <Flex
                            justifyContent="space-between"
                            alignItems="center"
                            xcss={styles.divider}
                        >
                            <Heading size="small">Auto-start application</Heading>
                            <Controller
                                name="autoStart"
                                control={control}
                                render={({ field }) => {
                                    return (
                                        <Toggle
                                            isChecked={field.value}
                                            onChange={field.onChange}
                                        />
                                    )
                                }}
                            />
                        </Flex>

                        <Flex
                            justifyContent="space-between"
                            alignItems="center"
                            xcss={styles.divider}
                        >
                            <Heading size="small">Time logging interval</Heading>

                            <Flex columnGap="space.100">
                                <Controller
                                    name="timeLoggingInterval.displayTime"
                                    control={control}
                                    rules={{ required: 'Required' }}
                                    render={({ field, fieldState }) => {
                                        return (
                                            <Box xcss={styles.inputWarp}>
                                                <Textfield
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    onBlur={field.onBlur}
                                                    type="number"
                                                />

                                                {fieldState.error?.message && <ErrorMessage>{fieldState.error?.message}</ErrorMessage>}
                                            </Box>
                                        )
                                    }}
                                />

                                <Controller
                                    name="timeLoggingInterval.unit"
                                    control={control}
                                    render={({ field, fieldState }) => {
                                        return (
                                            <Box xcss={styles.selectWarp}>
                                                <Select
                                                    value={field.value}
                                                    onChange={(newValue, actionMeta) => {
                                                        field.onChange(newValue, actionMeta)
                                                    }}
                                                    onBlur={field.onBlur}
                                                    placeholder="Unit"
                                                    styles={{
                                                        menuPortal: (base) => ({ ...base, zIndex: 1000 }),
                                                    }}
                                                    options={TIME_OPTIONS}
                                                    error={fieldState.error?.message}
                                                />
                                            </Box>
                                        )
                                    }}
                                />
                            </Flex>
                        </Flex>

                        <Flex
                            xcss={styles.divider}
                            justifyContent="space-between"
                        >
                            <Heading size="small">
                                Should send a notification when the application is open but not in use, and none of the tasks have been
                                taken into work.
                            </Heading>

                            <Flex
                                wrap="nowrap"
                                alignItems="center"
                                columnGap="space.100"
                            >
                                <Controller
                                    name="sendInactiveNotification.enabled"
                                    control={control}
                                    render={({ field }) => {
                                        return (
                                            <Box xcss={styles.toggleWarp}>
                                                <Toggle
                                                    isChecked={field.value}
                                                    onChange={field.onChange}
                                                />
                                            </Box>
                                        )
                                    }}
                                />

                                <Controller
                                    name="sendInactiveNotification.displayTime"
                                    control={control}
                                    rules={{ required: 'Required' }}
                                    render={({ field, fieldState }) => {
                                        return (
                                            <Box xcss={styles.inputWarp}>
                                                <Textfield
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    onBlur={field.onBlur}
                                                    type="number"
                                                />

                                                {fieldState.error?.message && <ErrorMessage>{fieldState.error?.message}</ErrorMessage>}
                                            </Box>
                                        )
                                    }}
                                />

                                <Controller
                                    name="sendInactiveNotification.unit"
                                    control={control}
                                    render={({ field, fieldState }) => {
                                        return (
                                            <Box xcss={styles.selectWarp}>
                                                <Select
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    onBlur={field.onBlur}
                                                    placeholder="Unit"
                                                    styles={{
                                                        menuPortal: (base) => ({ ...base, zIndex: 1000 }),
                                                    }}
                                                    options={TIME_OPTIONS}
                                                    error={fieldState.error?.message}
                                                    disabled={sendInactiveNotificationEnabled}
                                                />
                                            </Box>
                                        )
                                    }}
                                />
                            </Flex>
                        </Flex>

                        <Flex
                            xcss={styles.divider}
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <Heading size="small">To stop logging the time when the system is in a waiting state.</Heading>

                            <Flex
                                wrap="nowrap"
                                alignItems="center"
                                columnGap="space.100"
                            >
                                <Controller
                                    name="systemIdle.enabled"
                                    control={control}
                                    render={({ field }) => {
                                        return (
                                            <Box xcss={styles.toggleWarp}>
                                                <Toggle
                                                    isChecked={field.value}
                                                    onChange={field.onChange}
                                                />
                                            </Box>
                                        )
                                    }}
                                />

                                <Controller
                                    name="systemIdle.displayTime"
                                    control={control}
                                    rules={{ required: 'Required' }}
                                    render={({ field, fieldState }) => {
                                        return (
                                            <Box xcss={styles.inputWarp}>
                                                <Textfield
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    onBlur={field.onBlur}
                                                    type="number"
                                                />

                                                {fieldState.error?.message && <ErrorMessage>{fieldState.error?.message}</ErrorMessage>}
                                            </Box>
                                        )
                                    }}
                                />

                                <Controller
                                    name="systemIdle.unit"
                                    control={control}
                                    render={({ field, fieldState }) => {
                                        return (
                                            <Box xcss={styles.selectWarp}>
                                                <Select
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    onBlur={field.onBlur}
                                                    placeholder="Unit"
                                                    menuPortalTarget={document.body}
                                                    styles={{
                                                        menuPortal: (base) => ({ ...base, zIndex: 1000 }),
                                                    }}
                                                    options={TIME_OPTIONS}
                                                    error={fieldState.error?.message}
                                                    disabled={systemIdleEnabled}
                                                />
                                            </Box>
                                        )
                                    }}
                                />
                            </Flex>
                        </Flex>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            appearance="default"
                            onClick={() => setFalse('user settings')}
                        >
                            Cancel
                        </Button>
                        <Button
                            appearance="primary"
                            isLoading={isPending}
                            onClick={handleSubmit(onSave)}
                        >
                            Save
                        </Button>
                    </ModalFooter>
                </Modal>
            )}
        </>
    )
}

export default Settings
