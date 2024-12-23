import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import dayjs from 'dayjs'
import { PLUGINS, TIME_OPTIONS, UseGlobalState, useGlobalState } from '../../../shared/lib/hooks/useGlobalState'
import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle } from '@atlaskit/modal-dialog'
import Button, { IconButton } from '@atlaskit/button/new'
import CrossIcon from '@atlaskit/icon/glyph/cross'
import { Flex, xcss, Box, Text } from '@atlaskit/primitives'
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
import { createSearchParams, useNavigate } from 'react-router-dom'
import { electron } from 'react-app/shared/lib/electron/electron'
import { useFilterPUT } from 'react-app/entities/Filters'
import EditorWarningIcon from '@atlaskit/icon/glyph/editor/warning'
import EditorInfoIcon from '@atlaskit/icon/glyph/editor/info';
import Tooltip from '@atlaskit/tooltip'
import { useErrorNotifier } from 'react-app/shared/lib/hooks/useErrorNotifier'
import Checkbox from '@atlaskit/checkbox'

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

    const hasJiraTimeTrackingPermission = useGlobalState((state) => state.hasJiraTimeTrackingPermission)

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

    useErrorNotifier(filterPUT.error)

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
            pluginLogoutAlerts: {
                displayTime: data.pluginLogoutAlerts.displayTime,
                enabled: data.pluginLogoutAlerts.enabled,
                millisecond: dayjs.duration(data.pluginLogoutAlerts.displayTime, 'minutes').asMilliseconds(),
            },
            workingHoursPerDay: data.workingHoursPerDay,
            workingDaysPerWeek: data.workingDaysPerWeek,
            storyPointField: data.storyPointField,
            useStoryPointsAsTimeEstimate: data.useStoryPointsAsTimeEstimate,
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
                                    <Flex
                                        justifyContent="space-between"
                                        alignItems="center"
                                        xcss={styles.divider}
                                    >
                                        <Flex
                                            columnGap="space.100"
                                            alignItems="center"
                                        >
                                            <Image
                                                height="25px"
                                                width="25px"
                                                src="https://static.tempo.io/io/non-versioned/img/tempo-logo.png"
                                                loading="lazy"
                                            />
                                            <Flex>
                                                <Heading size="large">Tempo</Heading>

                                                {field.value === PLUGINS.TEMPO ? (
                                                    <CheckCircleIcon
                                                        label="tempo"
                                                        size="small"
                                                        primaryColor={token('color.text.accent.green')}
                                                    />
                                                ) : (
                                                    <CrossCircleIcon
                                                        label="tempo"
                                                        size="small"
                                                        primaryColor={token('color.text.accent.red')}
                                                    />
                                                )}
                                            </Flex>
                                        </Flex>

                                        {field.value === PLUGINS.TEMPO ? (
                                            <Button
                                                appearance="danger"
                                                onClick={() => {
                                                    localStorage.removeItem('pluginName')
                                                    field.onChange(null)
                                                }}
                                            >
                                                Disconnect
                                            </Button>
                                        ) : (
                                            <Button
                                                appearance="primary"
                                                onClick={() => {
                                                    navigate({
                                                        pathname: `/auth-plugin/${PLUGINS.TEMPO}`,
                                                    })
                                                    setFalse('user settings')
                                                }}
                                            >
                                                Connect
                                            </Button>
                                        )}
                                    </Flex>
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
                            <Flex
                                columnGap="space.100"
                                alignItems="center"
                            >
                                <Tooltip content="Enable notifications to alert you when a connected plugin (e.g., Tempo) loses access due to a session timeout.">
                                    {(tooltipProps) => (
                                        <div {...tooltipProps}>
                                            <EditorInfoIcon
                                                label="information"
                                                primaryColor={token('color.icon.information')}
                                            />
                                        </div>
                                    )}
                                </Tooltip>

                                <Heading size="small">Plugin logout alerts</Heading>
                            </Flex>



                            <Flex
                                wrap="nowrap"
                                alignItems="center"
                                columnGap="space.100"
                            >
                                <Controller
                                    name="pluginLogoutAlerts.enabled"
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
                                    name="pluginLogoutAlerts.displayTime"
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

                                <Text>Minutes</Text>
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

                        {!hasJiraTimeTrackingPermission && (
                            <>
                                <Flex
                                    xcss={styles.divider}
                                    justifyContent="space-between"
                                    alignItems="center"
                                >
                                    <Flex
                                        columnGap="space.100"
                                        alignItems="center"
                                    >
                                        <Tooltip content="You see this field in the settings because you do not have sufficient permissions to automatically retrieve data from Jira. The administrator has not granted you access to retrieve and read this data. Please ask your team for the value of this field and set it manually. Alternatively, request the administrator to grant you additional permissions for data access.">
                                            {(tooltipProps) => (
                                                <div {...tooltipProps}>
                                                    <EditorWarningIcon
                                                        label="warning"
                                                        primaryColor={token('color.icon.warning')}
                                                    />
                                                </div>
                                            )}
                                        </Tooltip>

                                        <Heading size="small">Working hours per day</Heading>
                                    </Flex>

                                    <Flex
                                        wrap="nowrap"
                                        alignItems="center"
                                        columnGap="space.100"
                                    >
                                        <Controller
                                            name="workingHoursPerDay"
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

                                                        {fieldState.error?.message && (
                                                            <ErrorMessage>{fieldState.error?.message}</ErrorMessage>
                                                        )}
                                                    </Box>
                                                )
                                            }}
                                        />

                                        <Text>Hours</Text>
                                    </Flex>
                                </Flex>

                                <Flex
                                    xcss={styles.divider}
                                    justifyContent="space-between"
                                    alignItems="center"
                                >
                                    <Flex
                                        columnGap="space.100"
                                        alignItems="center"
                                    >
                                        <Tooltip content="You see this field in the settings because you do not have sufficient permissions to automatically retrieve data from Jira. The administrator has not granted you access to retrieve and read this data. Please ask your team for the value of this field and set it manually. Alternatively, request the administrator to grant you additional permissions for data access.">
                                            {(tooltipProps) => (
                                                <div {...tooltipProps}>
                                                    <EditorWarningIcon
                                                        label="warning"
                                                        primaryColor={token('color.icon.warning')}
                                                    />
                                                </div>
                                            )}
                                        </Tooltip>

                                        <Heading size="small">Working days per week</Heading>
                                    </Flex>

                                    <Flex
                                        wrap="nowrap"
                                        alignItems="center"
                                        columnGap="space.100"
                                    >
                                        <Controller
                                            name="workingDaysPerWeek"
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

                                                        {fieldState.error?.message && (
                                                            <ErrorMessage>{fieldState.error?.message}</ErrorMessage>
                                                        )}
                                                    </Box>
                                                )
                                            }}
                                        />

                                        <Text>Days</Text>
                                    </Flex>
                                </Flex>
                            </>
                        )}

                        <Flex
                            xcss={styles.divider}
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <Flex
                                columnGap="space.100"
                                alignItems="center"
                            >
                                <Tooltip content="This setting allows you to specify the custom field key used for Story Points in Jira. By default, Story Points might be located in a custom field (e.g., customfield_10016). If your Jira administrator has configured Story Points to use a different custom field, you can update the key here to ensure proper functionality.">
                                    {(tooltipProps) => (
                                        <div {...tooltipProps}>
                                            <EditorInfoIcon
                                                label="information"
                                                primaryColor={token('color.icon.information')}
                                            />
                                        </div>
                                    )}
                                </Tooltip>

                                <Heading size="small">Custom field for story points</Heading>
                            </Flex>

                            <Flex
                                wrap="nowrap"
                                alignItems="center"
                                columnGap="space.100"
                            >
                                <Controller
                                    name="storyPointField"
                                    control={control}
                                    rules={{ required: 'Required' }}
                                    render={({ field, fieldState }) => {
                                        return (
                                            <Box>
                                                <Textfield
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    onBlur={field.onBlur}
                                                />

                                                {fieldState.error?.message && (
                                                    <ErrorMessage>{fieldState.error?.message}</ErrorMessage>
                                                )}
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
                            <Flex
                                columnGap="space.100"
                                alignItems="center"
                            >
                                <Tooltip content="Enable the use of story points as an equivalent to time estimation (e.g., hours or minutes) for tasks. When enabled, story points will be treated as a time value for tracking and planning purposes.">
                                    {(tooltipProps) => (
                                        <div {...tooltipProps}>
                                            <EditorInfoIcon
                                                label="information"
                                                primaryColor={token('color.icon.information')}
                                            />
                                        </div>
                                    )}
                                </Tooltip>

                                <Heading size="small">Use story points as time estimate</Heading>
                            </Flex>

                            <Flex
                                wrap="nowrap"
                                alignItems="center"
                                columnGap="space.100"
                            >
                                <Controller
                                    name="useStoryPointsAsTimeEstimate"
                                    control={control}
                                    render={({ field, fieldState }) => {
                                        return (
                                            <Box>
                                                <Checkbox
                                                    isChecked={field.value}
                                                    onChange={field.onChange}
                                                    onBlur={field.onBlur}
                                                />

                                                {fieldState.error?.message && (
                                                    <ErrorMessage>{fieldState.error?.message}</ErrorMessage>
                                                )}
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
