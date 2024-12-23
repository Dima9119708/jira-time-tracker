import { Issue } from 'react-app/shared/types/Jira/Issues'
import SectionMessage from '@atlaskit/section-message'
import { secondsToUIFormat } from 'react-app/shared/lib/helpers/secondsToUIFormat'
import { globalBooleanActions } from 'use-global-boolean'
import { usePersistLostTime } from '../model/usePersistLostTime'
import { ConfirmDelete } from 'react-app/shared/components/ConfirmDelete'
import React, { memo, FC, PropsWithChildren, useState, HTMLAttributes } from 'react'
import { useMidnightCountdown } from 'react-app/shared/lib/hooks/useMidnightCountdown'
import { LogTimeAutoBaseProps } from 'react-app/widgets/LogTimeAuto'
import DropdownMenu, { DropdownItem } from '@atlaskit/dropdown-menu'
import Spinner from '@atlaskit/spinner'
import { token } from '@atlaskit/tokens'

interface LogTimeErrorNotificationProps extends Pick<LogTimeAutoBaseProps, 'invalidateQueries'> {
    issueId: Issue['id']
    isLogTimeAction?: boolean
    isAddToTimeSpentAction?: boolean
    onAddToTimeSpent?: (timeSpentSeconds: number) => void
    LogTimeAutoComponent?: FC<LogTimeAutoBaseProps>
}

interface RenderMessageProps extends LogTimeErrorNotificationProps {
    timeSpentSeconds: number
    remove: (issueId: Issue['id']) => void
    clear: () => void
}

const SectionMessageAction = (props: PropsWithChildren<HTMLAttributes<HTMLSpanElement>>) => {
    return <span style={{ color: token('color.link'), fontWeight: 500, cursor: 'pointer' }}>{props.children}</span>
}

const RenderMessage = (props: RenderMessageProps) => {
    const {
        issueId,
        isAddToTimeSpentAction,
        isLogTimeAction,
        timeSpentSeconds,
        onAddToTimeSpent,
        remove,
        clear,
        LogTimeAutoComponent,
        invalidateQueries,
    } = props
    const [isAddToTimeSpent, setIsAddToTimeSpent] = useState(false)
    const [isOpenDropdown, setOpenDropdown] = useState(false)

    const lostTimeUI = secondsToUIFormat(timeSpentSeconds, true)

    const remainingTime = useMidnightCountdown(clear)

    return (
        <SectionMessage
            title={`Error During Logging at ${lostTimeUI}`}
            appearance={isAddToTimeSpent ? 'success' : 'error'}
            actions={[
                <SectionMessageAction>
                    <ConfirmDelete
                        title="Are you sure you want to delete this time entry?"
                        onYes={() => {
                            remove(issueId)
                        }}
                    >
                        {({ triggerProps, setIsOpen }) => {
                            return (
                                <div
                                    {...triggerProps}
                                    onClick={() => setIsOpen((prevState) => !prevState)}
                                >
                                    Delete
                                </div>
                            )
                        }}
                    </ConfirmDelete>
                </SectionMessageAction>,

                isAddToTimeSpentAction && (
                    <SectionMessageAction
                        onClick={() => {
                            onAddToTimeSpent?.(timeSpentSeconds)
                            setIsAddToTimeSpent(true)
                        }}
                    >
                        Add to Time Spent
                    </SectionMessageAction>
                ),

                isLogTimeAction && LogTimeAutoComponent && (
                    <DropdownMenu
                        isOpen={isOpenDropdown}
                        onOpenChange={() => setOpenDropdown((prevState) => !prevState)}
                        trigger={(triggerButtonProps) => (
                            <SectionMessageAction>
                                <div
                                    {...triggerButtonProps}
                                    ref={triggerButtonProps.triggerRef}
                                >
                                    Log time
                                </div>
                            </SectionMessageAction>
                        )}
                    >
                        <DropdownItem
                            onClick={(e) => {
                                e.stopPropagation()
                                globalBooleanActions.setTrue('LOG_TIME_ISSUE', issueId)
                            }}
                        >
                            Manual
                        </DropdownItem>

                        <LogTimeAutoComponent
                            issueId={issueId}
                            invalidateQueries={invalidateQueries}
                            onSuccess={() => remove(issueId)}
                        >
                            {({ onLogTime, isLoading }) => (
                                <DropdownItem
                                    isDisabled={isLoading}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        onLogTime(timeSpentSeconds)
                                    }}
                                    elemAfter={isLoading && <Spinner size="small" />}
                                >
                                    Auto Log
                                </DropdownItem>
                            )}
                        </LogTimeAutoComponent>
                    </DropdownMenu>
                ),
            ].filter((action) => action !== false && action !== undefined)}
        >
            An error occurred, possibly due to server issues or other problems. You can manually log the time if necessary. If not logged,
            this entry will be removed in <strong>{remainingTime}</strong>.
        </SectionMessage>
    )
}

const LogTimeErrorNotification = (props: LogTimeErrorNotificationProps) => {
    const { issueId, isLogTimeAction = true, invalidateQueries } = props

    const { lostTime, remove, clear } = usePersistLostTime(issueId)

    return (
        lostTime && (
            <RenderMessage
                {...props}
                remove={remove}
                clear={clear}
                invalidateQueries={invalidateQueries}
                isLogTimeAction={isLogTimeAction}
                timeSpentSeconds={lostTime.timeSpentSeconds}
            />
        )
    )
}

export default memo(LogTimeErrorNotification)
