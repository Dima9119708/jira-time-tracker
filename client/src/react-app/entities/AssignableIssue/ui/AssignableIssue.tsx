import { Image, Menu, Skeleton } from '@mantine/core'
import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '../../../shared/config/api/api'
import { AssignableIssueProps } from '../types/types'
import { AssignableResponse } from '../../../pages/Issues/types/types'
import { IconUser } from '@tabler/icons-react'
import { cn } from '../../../shared/lib/classNames '

const AssignableIssue = (props: AssignableIssueProps) => {
    const { issueKey, assignee, onChange, children, position = 'bottom-start' } = props
    const [open, setOpen] = useState(false)

    const { data, isLoading } = useQuery({
        queryKey: ['assignable issue', issueKey],
        queryFn: () => axiosInstance.get<AssignableResponse>('/issue-assignable', { params: { id: issueKey } }),
        select: (response) => {
            return [...response.data, { accountId: null, displayName: 'Unassigned', avatarUrls: undefined }].sort((a, b) =>
                a.displayName.localeCompare(b.displayName)
            )
        },
        enabled: open,
    })

    return (
        <Menu
            shadow="md"
            onChange={setOpen}
            position={position}
        >
            <Menu.Target>
                {children({
                    name: assignee?.displayName ?? 'Unassigned',
                    ImageComponent: assignee?.avatarUrls?.['48x48'] ? (
                        <Image
                            h={20}
                            w={20}
                            loading="lazy"
                            src={assignee.avatarUrls['48x48']}
                        />
                    ) : (
                        <IconUser
                            height={23}
                            width={23}
                            color="black"
                        />
                    ),
                })}
            </Menu.Target>

            <Menu.Dropdown>
                {isLoading &&
                    Array.from({ length: 5 }, (_, idx) => (
                        <Menu.Item key={idx}>
                            <Skeleton
                                w={100}
                                h={20}
                                bg="cyan.6"
                            />
                        </Menu.Item>
                    ))}
                {!isLoading &&
                    data?.map((user) => (
                        <Menu.Item
                            onClick={() => onChange(user)}
                            key={user.accountId}
                            className={cn({
                                'bg-[var(--mantine-color-dark-light)]': user.accountId === assignee?.accountId,
                            })}
                            value={user.displayName}
                            leftSection={
                                user?.avatarUrls?.['48x48'] ? (
                                    <Image
                                        h={20}
                                        w={20}
                                        loading="lazy"
                                        src={user.avatarUrls['48x48']}
                                    />
                                ) : (
                                    <IconUser
                                        height={23}
                                        width={23}
                                        color="black"
                                    />
                                )
                            }
                        >
                            {user.displayName}
                        </Menu.Item>
                    ))}
            </Menu.Dropdown>
        </Menu>
    )
}

export default AssignableIssue
