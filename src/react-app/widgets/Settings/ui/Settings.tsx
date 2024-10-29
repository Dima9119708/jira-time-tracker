import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import dayjs from 'dayjs'
import { PLUGINS, TIME_OPTIONS, UseGlobalState, useGlobalState } from '../../../shared/lib/hooks/useGlobalState'
import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle } from '@atlaskit/modal-dialog'
import Button, { IconButton } from '@atlaskit/button/new'
import CrossIcon from '@atlaskit/icon/glyph/cross'
import { Flex, xcss, Box } from '@atlaskit/primitives'
import Toggle from '@atlaskit/toggle'
import Textfield from '@atlaskit/textfield'
import Select from '@atlaskit/select'
import Heading from '@atlaskit/heading'
import { ErrorMessage } from '@atlaskit/form'
import { useGlobalBoolean } from 'use-global-boolean'
import Image from '@atlaskit/image'
import CheckCircleIcon from '@atlaskit/icon/glyph/check-circle'
import CrossCircleIcon from '@atlaskit/icon/glyph/cross-circle'
import { token } from '@atlaskit/tokens'
import { useNavigate } from 'react-router-dom'
import { electron } from 'react-app/shared/lib/electron/electron'
import { useFilterPUT } from 'react-app/entities/Filters'

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
    const navigate = useNavigate()

    const opened = watchBoolean('user settings')

    const { control, handleSubmit, watch, getValues } = useForm<FormValues>({
        mode: 'onBlur',
        defaultValues: useGlobalState.getState().settings,
    })

    const sendInactiveNotificationEnabled = !watch('sendInactiveNotification.enabled')
    const systemIdleEnabled = !watch('systemIdle.enabled')

    const filterPUT = useFilterPUT({
        onSuccess: () => {
            if (typeof getValues('plugin') !== 'string') {
                electron(async (methods) => {
                    await methods.ipcRenderer.invoke('DELETE_AUTH_PLUGIN_DATA')
                })
            }

            setFalse('user settings')
        },
    })

    const onSave: SubmitHandler<FormValues> = (data) => {
        const newSettings: Partial<UseGlobalState['settings']> = {
            plugin: data.plugin,
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

        filterPUT.mutate({
            settings: newSettings,
        })
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
                        <Controller
                            name="plugin"
                            control={control}
                            render={({ field }) => {
                                return (
                                    <Box
                                        xcss={xcss({
                                            marginBottom: 'space.250',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                        })}
                                        onClick={() => {
                                            if (field.value === PLUGINS.TEMPO) {
                                                localStorage.removeItem('pluginName')
                                                field.onChange(null)
                                            } else {
                                                navigate('/auth-plugin')
                                                localStorage.setItem('pluginName', PLUGINS.TEMPO)
                                                setFalse('user settings')
                                            }
                                        }}
                                    >
                                        <Image
                                            height="20px"
                                            src="https://www.tempo.io/images/brand/tempo-full-logo.svg"
                                            loading="lazy"
                                        />
                                        {field.value === PLUGINS.TEMPO ? (
                                            <CheckCircleIcon
                                                label="tempo"
                                                primaryColor={token('color.text.accent.green')}
                                            />
                                        ) : (
                                            <CrossCircleIcon
                                                label="tempo"
                                                primaryColor={token('color.text.accent.red')}
                                            />
                                        )}
                                    </Box>
                                )
                            }}
                        />

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
                            isLoading={filterPUT.isPending}
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
