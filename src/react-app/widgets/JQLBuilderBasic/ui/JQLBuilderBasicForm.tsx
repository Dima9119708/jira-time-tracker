import { Box, Flex, xcss } from '@atlaskit/primitives'
import { StatusesDropdown } from 'react-app/entities/Status'
import { Control, FormProvider, useController, useForm, useFormContext, useWatch } from 'react-hook-form'
import { ProjectsDropdown } from 'react-app/entities/Projects'
import { AssigneeDropdown } from 'react-app/entities/UserSearch'
import DropdownMenu, { DropdownItemRadio } from '@atlaskit/dropdown-menu'
import { useCallback, useState } from 'react'
import { token } from '@atlaskit/tokens'
import Button from '@atlaskit/button/new'
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down'
import { PriorityMultiDropdown } from 'react-app/entities/PrioritySchemes'
import { ProjectValue } from 'react-app/entities/Projects/ui/ProjectsDropdown'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError, AxiosResponse } from 'axios'
import { FilterDetails } from 'react-app/pages/Issues/types/types'
import { ErrorType } from 'react-app/shared/types/jiraTypes'
import { axiosInstance } from 'react-app/shared/config/api/api'
import { useGlobalState } from 'react-app/shared/lib/hooks/useGlobalState'
import { useNotifications } from 'react-app/shared/lib/hooks/useNotifications'
import { useFilterPUT } from 'react-app/entities/Filters'

export type JQLBasic = {
    priority: string[] | undefined
    statuses: string[] | undefined
    projects: ProjectValue[] | undefined
    assignees: string[] | undefined
    prioritySort: 'ASC' | 'DESC' | ''
    createdSort: 'ASC' | 'DESC' | ''
}

type SubmitHandler = (data: JQLBasic) => void

const formatJQLInClause = (field: string, values?: string[] | ProjectValue[], mapFn?: (value: any) => string) => {
    if (!values?.length) return ''
    const formattedValues = mapFn ? values.map(mapFn) : values
    return `${field} in (${formattedValues.join(',')})`
}

const formatJQLSortClause = (prioritySort: 'ASC' | 'DESC' | '', createdSort: 'ASC' | 'DESC' | '') => {
    if (prioritySort && createdSort) return `ORDER BY priority ${prioritySort}, created ${createdSort}`
    if (createdSort) return `ORDER BY created ${createdSort}`
    if (prioritySort) return `ORDER BY priority ${prioritySort}`
    return ''
}

const Statuses = (props: { control: Control<JQLBasic>; onSubmit: SubmitHandler }) => {
    const { control, onSubmit } = props
    const { handleSubmit } = useFormContext()

    const projects = useWatch({
        control,
        name: 'projects',
    })

    const { field } = useController({
        control,
        name: 'statuses',
    })

    const onChange = (statusesIds: string[]) => {
        field.onChange(statusesIds)
        // @ts-ignore
        handleSubmit(onSubmit)()
    }

    return (
        <StatusesDropdown
            values={field.value}
            projectIds={projects?.map((project: any) => project.id)}
            onChange={onChange}
            elemAfterDropdownItems={<Button onClick={() => onChange([])}>Clear</Button>}
        />
    )
}

const Projects = (props: { control: Control<JQLBasic>; onSubmit: SubmitHandler }) => {
    const { control, onSubmit } = props

    const { handleSubmit } = useFormContext()

    const { setValue } = useFormContext()

    const { field } = useController({
        control,
        name: 'projects',
    })

    const onChange = (projects: ProjectValue[]) => {
        field.onChange(projects)

        setValue('statuses', [])
        setValue('assignees', [])
        setValue('priority', [])

        // @ts-ignore
        handleSubmit(onSubmit)()
    }

    return (
        <ProjectsDropdown
            values={field.value}
            onChange={onChange}
            elemAfterDropdownItems={<Button onClick={() => onChange([])}>Clear</Button>}
        />
    )
}

const Assignees = (props: { control: Control<JQLBasic>; onSubmit: SubmitHandler }) => {
    const { control, onSubmit } = props

    const { handleSubmit } = useFormContext()

    const projects = useWatch({
        control,
        name: 'projects',
    })

    const { field } = useController({
        control,
        name: 'assignees',
    })

    const onChange = (ids: string[]) => {
        field.onChange(ids)
        // @ts-ignore
        handleSubmit(onSubmit)()
    }

    return (
        <AssigneeDropdown
            projectKeys={projects?.map((project: any) => project.key)}
            values={field.value}
            onChange={onChange}
            elemAfterDropdownItems={<Button onClick={() => onChange([])}>Clear</Button>}
        />
    )
}

const Priority = (props: { control: Control<JQLBasic>; onSubmit: SubmitHandler }) => {
    const { control, onSubmit } = props

    const { handleSubmit } = useFormContext()

    const projects = useWatch({
        control,
        name: 'projects',
    })

    const { field } = useController({
        control,
        name: 'priority',
    })

    const onChange = (ids: string[]) => {
        field.onChange(ids)
        // @ts-ignore
        handleSubmit(onSubmit)()
    }

    return (
        <PriorityMultiDropdown
            values={field.value}
            projectIds={projects?.map((project) => project.id)}
            onChange={onChange}
            elemAfterDropdownItems={<Button onClick={() => onChange([])}>Clear</Button>}
        />
    )
}

const CreatedSort = (props: { control: Control<JQLBasic>; onSubmit: SubmitHandler }) => {
    const { control, onSubmit } = props
    const [open, setOpen] = useState(false)
    const { handleSubmit } = useFormContext()

    const { field } = useController({
        control,
        name: 'createdSort',
    })

    const onChange = (sort: JQLBasic['createdSort']) => {
        field.onChange(sort)
        // @ts-ignore
        handleSubmit(onSubmit)()
    }

    return (
        <DropdownMenu
            isOpen={open}
            onOpenChange={() => setOpen(!open)}
            trigger={(triggerButtonProps) => (
                <Box
                    xcss={xcss({
                        // @ts-ignore
                        ...(field.value && {
                            '& > button, & > button:hover': {
                                backgroundColor: token('color.background.selected'),
                                color: token('color.text.selected'),
                            },
                        }),
                    })}
                >
                    <Button
                        {...triggerButtonProps}
                        ref={triggerButtonProps.triggerRef}
                        iconAfter={ChevronDownIcon}
                    >
                        {`Created sort ${!field.value ? '' : `(${field.value || ''})`} `}
                    </Button>
                </Box>
            )}
        >
            <DropdownItemRadio
                id="asc"
                isSelected={field.value === 'ASC'}
                onClick={() => onChange('ASC')}
            >
                ASC
            </DropdownItemRadio>
            <DropdownItemRadio
                id="desk"
                isSelected={field.value === 'DESC'}
                onClick={() => onChange('DESC')}
            >
                DESC
            </DropdownItemRadio>
            <Button onClick={() => onChange('')}>Clear</Button>
        </DropdownMenu>
    )
}

const PrioritySort = (props: { control: Control<JQLBasic>; onSubmit: SubmitHandler }) => {
    const { control, onSubmit } = props
    const [open, setOpen] = useState(false)

    const { handleSubmit } = useFormContext()

    const { field } = useController({
        control,
        name: 'prioritySort',
    })

    const onChange = (sort: 'ASC' | 'DESC' | '') => {
        field.onChange(sort)
        // @ts-ignore
        handleSubmit(onSubmit)()
    }

    return (
        <DropdownMenu
            isOpen={open}
            onOpenChange={() => setOpen(!open)}
            trigger={(triggerButtonProps) => (
                <Box
                    xcss={xcss({
                        // @ts-ignore
                        ...(field.value && {
                            '& > button, & > button:hover': {
                                backgroundColor: token('color.background.selected'),
                                color: token('color.text.selected'),
                            },
                        }),
                    })}
                >
                    <Button
                        {...triggerButtonProps}
                        ref={triggerButtonProps.triggerRef}
                        iconAfter={ChevronDownIcon}
                    >
                        {`Priority sort ${!field.value ? '' : `(${field.value || ''})`} `}
                    </Button>
                </Box>
            )}
        >
            <DropdownItemRadio
                id="asc"
                isSelected={field.value === 'ASC'}
                onClick={() => onChange('ASC')}
            >
                ASC
            </DropdownItemRadio>
            <DropdownItemRadio
                id="desk"
                isSelected={field.value === 'DESC'}
                onClick={() => onChange('DESC')}
            >
                DESC
            </DropdownItemRadio>

            <Button onClick={() => onChange('')}>Clear</Button>
        </DropdownMenu>
    )
}

const JQLBuilderBasicForm = () => {
    const formMethods = useForm<JQLBasic>({
        mode: 'onChange',
        defaultValues: useGlobalState.getState().settings.jqlBasic,
    })

    const { control } = formMethods

    const queryClient = useQueryClient()

    const filterPUT = useFilterPUT({
        titleLoading: 'Searching',
        titleSuccess: '',
        titleError: 'Filter update error',
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['tasks'],
            })
        },
    })

    const onSubmit = useCallback((data: JQLBasic) => {
        const JQLSeparatedAndOperator = [
            formatJQLInClause('project', data.projects, (project: ProjectValue) => project.id),
            formatJQLInClause('status', data.statuses, (status: string) => `"${status}"`),
            formatJQLInClause('assignee', data.assignees),
            formatJQLInClause('priority', data.priority),
        ]
            .filter(Boolean)
            .join(' AND ')

        const JQLSortFormat = formatJQLSortClause(data.prioritySort, data.createdSort)

        const combinedJQL = [JQLSeparatedAndOperator, JQLSortFormat].filter(Boolean).join(' ')

        filterPUT.mutate({
            description: {
                jqlBasic: data,
            },
            jql: combinedJQL,
        })
    }, [])

    return (
        <Flex
            columnGap="space.100"
            rowGap="space.100"
            wrap="wrap"
            xcss={xcss({ marginBottom: 'space.250' })}
        >
            <FormProvider {...formMethods}>
                <Projects
                    control={control}
                    onSubmit={onSubmit}
                />
                <Statuses
                    control={control}
                    onSubmit={onSubmit}
                />
                <Assignees
                    control={control}
                    onSubmit={onSubmit}
                />
                <CreatedSort
                    control={control}
                    onSubmit={onSubmit}
                />
                <PrioritySort
                    control={control}
                    onSubmit={onSubmit}
                />
                <Priority
                    control={control}
                    onSubmit={onSubmit}
                />
            </FormProvider>
        </Flex>
    )
}

export default JQLBuilderBasicForm
