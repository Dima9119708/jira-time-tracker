import { Menu, Skeleton } from '@mantine/core'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '../../../shared/config/api/api'
import { StatusesTaskResponse, StatusesTaskProps } from '../types/types'

const StatusesTask = (props: StatusesTaskProps) => {
    const { id, onChange, children, position = 'bottom-start', disabled } = props
    const [open, setOpen] = useState(false)

    const { data, isLoading } = useQuery({
        queryKey: ['statuses task', id],
        queryFn: () => axiosInstance.get<StatusesTaskResponse>('/statuses-task', { params: { id } }),
        select: (data) => data.data,
        enabled: open,
    })

    return (
        <Menu
            shadow="md"
            onChange={disabled ? undefined : setOpen}
            position={position}
            disabled={disabled}
        >
            <Menu.Target>{children}</Menu.Target>

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
                    data?.transitions.map((transition) => (
                        <Menu.Item
                            onClick={() => onChange(transition)}
                            key={transition.id}
                            value={transition.name}
                        >
                            {transition.name}
                        </Menu.Item>
                    ))}
            </Menu.Dropdown>
        </Menu>
    )
}

export default StatusesTask
