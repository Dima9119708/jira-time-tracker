import { Flex, xcss } from '@atlaskit/primitives'
import { StatusesDropdown } from 'react-app/entities/Status'
import { FormProvider, useController, useForm, useFormContext, useWatch } from 'react-hook-form'
import { ProjectsDropdown } from 'react-app/entities/Projects'
import { AssignableMultiProjectSearch, UserSearchDropdown } from 'react-app/entities/UserSearch'
import DropdownMenu, { DropdownItemRadio } from '@atlaskit/dropdown-menu'
import { memo, useCallback, useEffect, useState } from 'react'
import Button from '@atlaskit/button/new'
import { PriorityMultiDropdown } from 'react-app/entities/PrioritySchemes'
import { ProjectValue } from 'react-app/entities/Projects/ui/ProjectsDropdown'
import { useQueryClient } from '@tanstack/react-query'
import { useGlobalState } from 'react-app/shared/lib/hooks/useGlobalState'
import { useFilterPUT } from 'react-app/entities/Filters'
import { JQLBasicDropdownTriggerButton } from 'react-app/shared/components/JQLBasicDropdownTriggerButton'
import { SearchByIssues, SearchByIssuesExpanded, SearchData } from 'react-app/features/SearchByIssues'
import { Assignee, Issue, Priority as PriorityType, Status as StatusType } from 'react-app/shared/types/Jira/Issues'
import { EnumSortOrder } from 'react-app/shared/types/common'
import deepmerge from 'react-app/shared/lib/utils/deepMerge'
import { useErrorNotifier } from 'react-app/shared/lib/hooks/useErrorNotifier'

export type JQLBasic = {
    priority: Array<PriorityType['name']> | undefined
    statuses: Array<StatusType['name']> | undefined
    projects: ProjectValue[] | undefined
    assignees: Array<Assignee['accountId']> | undefined
    prioritySort: EnumSortOrder
    createdSort: EnumSortOrder
    statusSort: EnumSortOrder
    search: SearchData | undefined
    issueSelect: Issue['id'] | undefined
}

interface SortCriteria {
    field: string
    order: EnumSortOrder
}

type SubmitHandler = (data: JQLBasic) => void

const DEFAULT_VALUES: JQLBasic = {
    priority: [],
    statuses: [],
    projects: [],
    assignees: [],
    prioritySort: EnumSortOrder.NONE,
    createdSort: EnumSortOrder.NONE,
    statusSort: EnumSortOrder.NONE,
    issueSelect: '',
    search: {
        value: '',
        issueIds: [],
    },
}

const formatJQLInClause = (field: string, values?: Array<string | null | number> | ProjectValue[], mapFn?: (value: any) => string) => {
    if (!values?.length) return ''
    const formattedValues = mapFn ? values.map(mapFn) : values
    return `${field} in (${formattedValues.join(',')})`
}

const formatJQLSortClause = (sortCriteria: SortCriteria[]): string => {
    if (sortCriteria.length === 0) return ''

    const clauses = sortCriteria.filter(({ order }) => order).map(({ field, order }) => `${field} ${order}`)

    return clauses.length > 0 ? `ORDER BY ${clauses.join(', ')}` : ''
}

const Search = ({ onSubmit }: { onSubmit: SubmitHandler }) => {
    const { control, handleSubmit } = useFormContext<JQLBasic>()

    const { field } = useController({
        control,
        name: 'search',
    })

    return (
        <SearchByIssues
            value={field.value?.value}
            onChange={(jql) => {
                field.onChange(jql)
                handleSubmit(onSubmit)()
            }}
        />
    )
}

const IssueSelect = ({ onSubmit }: { onSubmit: SubmitHandler }) => {
    const { control, handleSubmit, reset } = useFormContext<JQLBasic>()

    const { field } = useController({
        control,
        name: 'issueSelect',
    })
console.log('field =>', field.value)
    const onChange = useCallback((issue: Issue) => {
        reset(Object.assign(DEFAULT_VALUES, {
            issueSelect: issue.id,
        }))
        handleSubmit(onSubmit)()
    }, [])

    return (
        <div style={{ flexBasis: '100%' }}>
            <SearchByIssuesExpanded
                issueId={field.value}
                onChange={onChange}
            />
        </div>
    )
}

const Statuses = ({ onSubmit }: { onSubmit: SubmitHandler }) => {
    const { control, handleSubmit } = useFormContext<JQLBasic>()

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

const Projects = ({ onSubmit }: { onSubmit: SubmitHandler }) => {
    const { setValue, control, handleSubmit } = useFormContext<JQLBasic>()

    const { field } = useController({
        control,
        name: 'projects',
    })

    const onChange = (projects: ProjectValue[]) => {
        setValue('statuses', [])
        setValue('assignees', [])
        setValue('priority', [])

        field.onChange(projects)
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

const Assignees = ({ onSubmit }: { onSubmit: SubmitHandler }) => {
    const { control, handleSubmit } = useFormContext<JQLBasic>()

    const projects = useWatch({
        control,
        name: 'projects',
    })

    const projectKeys = projects?.map((project: ProjectValue) => project.key) || []

    const { field } = useController({
        control,
        name: 'assignees',
    })

    const onChange = (ids: JQLBasic['assignees']) => {
        field.onChange(ids)
        handleSubmit(onSubmit)()
    }

    return projectKeys?.length > 0 ? (
        <AssignableMultiProjectSearch
            projectKeys={projectKeys}
            values={field.value}
            onChange={onChange}
            elemAfterDropdownItems={<Button onClick={() => onChange([])}>Clear</Button>}
        />
    ) : (
        <UserSearchDropdown
            values={field.value}
            onChange={onChange}
            elemAfterDropdownItems={<Button onClick={() => onChange([])}>Clear</Button>}
        />
    )
}

const Priority = ({ onSubmit }: { onSubmit: SubmitHandler }) => {
    const { control, handleSubmit } = useFormContext<JQLBasic>()

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

const CreatedSort = ({ onSubmit }: { onSubmit: SubmitHandler }) => {
    const [open, setOpen] = useState(false)
    const { setValue, control, handleSubmit } = useFormContext<JQLBasic>()

    const { field } = useController({
        control,
        name: 'createdSort',
        defaultValue: EnumSortOrder.NONE
    })

    const onChange = (sort: JQLBasic['createdSort']) => {
        setValue('prioritySort', EnumSortOrder.NONE)
        setValue('statusSort', EnumSortOrder.NONE)

        field.onChange(sort)

        handleSubmit(onSubmit)()
    }

    return (
        <DropdownMenu
            isOpen={open}
            onOpenChange={() => setOpen(!open)}
            trigger={(triggerButtonProps) => (
                <JQLBasicDropdownTriggerButton
                    values={field.value}
                    triggerButtonProps={triggerButtonProps}
                    title={`Sort by Created Date ${!field.value ? '' : `(${field.value || ''})`} `}
                />
            )}
        >
            <DropdownItemRadio
                id="asc"
                isSelected={field.value === EnumSortOrder.ASC}
                onClick={() => onChange(EnumSortOrder.ASC)}
            >
                {EnumSortOrder.ASC}
            </DropdownItemRadio>
            <DropdownItemRadio
                id="desk"
                isSelected={field.value === EnumSortOrder.DESC}
                onClick={() => onChange(EnumSortOrder.DESC)}
            >
                {EnumSortOrder.DESC}
            </DropdownItemRadio>
            <Button onClick={() => onChange(EnumSortOrder.NONE)}>Clear</Button>
        </DropdownMenu>
    )
}

const PrioritySort = ({ onSubmit }: { onSubmit: SubmitHandler }) => {
    const [open, setOpen] = useState(false)

    const { setValue, control, handleSubmit } = useFormContext<JQLBasic>()

    const { field } = useController({
        control,
        name: 'prioritySort',
        defaultValue: EnumSortOrder.NONE
    })

    const onChange = (sort: EnumSortOrder) => {
        setValue('createdSort', EnumSortOrder.NONE)
        setValue('statusSort', EnumSortOrder.NONE)
        field.onChange(sort)

        handleSubmit(onSubmit)()
    }

    return (
        <DropdownMenu
            isOpen={open}
            onOpenChange={() => setOpen(!open)}
            trigger={(triggerButtonProps) => (
                <JQLBasicDropdownTriggerButton
                    values={field.value}
                    triggerButtonProps={triggerButtonProps}
                    title={`Sort by Priority ${!field.value ? '' : `(${field.value || ''})`} `}
                />
            )}
        >
            <DropdownItemRadio
                id="asc"
                isSelected={field.value === EnumSortOrder.ASC}
                onClick={() => onChange(EnumSortOrder.ASC)}
            >
                {EnumSortOrder.ASC}
            </DropdownItemRadio>
            <DropdownItemRadio
                id="desk"
                isSelected={field.value === EnumSortOrder.DESC}
                onClick={() => onChange(EnumSortOrder.DESC)}
            >
                {EnumSortOrder.DESC}
            </DropdownItemRadio>

            <Button onClick={() => onChange(EnumSortOrder.NONE)}>Clear</Button>
        </DropdownMenu>
    )
}

const StatusSort = ({ onSubmit }: { onSubmit: SubmitHandler }) => {
    const [open, setOpen] = useState(false)

    const { handleSubmit, setValue, control } = useFormContext<JQLBasic>()

    const { field } = useController({
        control,
        name: 'statusSort',
        defaultValue: EnumSortOrder.NONE
    })

    const onChange = (sort: EnumSortOrder) => {
        setValue('prioritySort', EnumSortOrder.NONE)
        setValue('createdSort', EnumSortOrder.NONE)

        field.onChange(sort)
        handleSubmit(onSubmit)()
    }

    return (
        <DropdownMenu
            isOpen={open}
            onOpenChange={() => setOpen(!open)}
            trigger={(triggerButtonProps) => (
                <JQLBasicDropdownTriggerButton
                    values={field.value}
                    triggerButtonProps={triggerButtonProps}
                    title={`Sort by Status ${!field.value ? '' : `(${field.value || ''})`} `}
                />
            )}
        >
            <DropdownItemRadio
                id="asc"
                isSelected={field.value === EnumSortOrder.ASC}
                onClick={() => onChange(EnumSortOrder.ASC)}
            >
                {EnumSortOrder.ASC}
            </DropdownItemRadio>
            <DropdownItemRadio
                id="desk"
                isSelected={field.value === EnumSortOrder.DESC}
                onClick={() => onChange(EnumSortOrder.DESC)}
            >
                {EnumSortOrder.DESC}
            </DropdownItemRadio>

            <Button onClick={() => onChange(EnumSortOrder.NONE)}>Clear</Button>
        </DropdownMenu>
    )
}

const ResetForm = ({ onSubmit }: { onSubmit: SubmitHandler }) => {
    const { reset, control, handleSubmit, setValue } = useFormContext<JQLBasic>()

    const formValues = useWatch({
        control,
    })

    const isFormEmpty = useCallback((values: any) => {
        if (typeof values === 'object' && values !== null) {
            return Object.values(values).every(isFormEmpty)
        }
        return values === ''
    }, [])

    const formIsEmpty = isFormEmpty(formValues)

    return (
        !formIsEmpty && (
            <Button
                appearance="warning"
                onClick={() => {
                    reset({ ...DEFAULT_VALUES, issueSelect: '' })
                    handleSubmit(onSubmit)()
                }}
            >
                Reset
            </Button>
        )
    )
}

const JQLBuilderBasicForm = () => {
    const formMethods = useForm<JQLBasic>({
        mode: 'onChange',
        defaultValues: deepmerge(DEFAULT_VALUES, useGlobalState.getState().settings.jqlBasic, { clone: true }),
    })

    const queryClient = useQueryClient()

    const filterPUT = useFilterPUT({
        titleLoading: 'Searching',
        titleSuccess: '',
        titleError: 'Filter update error',
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['issues'],
            })
        },
    })

    useErrorNotifier(filterPUT.error)

    useEffect(() => {
        const { unsubscribe } = formMethods.watch((value, info) => {
            if (info.name !== 'issueSelect' && info.type === 'change') {
                formMethods.setValue('issueSelect', '')
            }
        })

        return unsubscribe
    }, [formMethods.watch])

    const onSubmit = useCallback((data: JQLBasic) => {
        const JQLSeparatedAndOperator = [
            formatJQLInClause('issue', data.issueSelect ? [data.issueSelect] : []),
            formatJQLInClause('issue', data.search?.issueIds),
            formatJQLInClause('project', data.projects, (project: ProjectValue) => project.id),
            formatJQLInClause('status', data.statuses, (status: string) => `"${status}"`),
            formatJQLInClause('assignee', data.assignees, (assignee: string | null) => (assignee === null ? 'null' : assignee)),
            formatJQLInClause('priority', data.priority),
        ]
            .filter(Boolean)
            .join(' AND ')

        const JQLSortFormat = formatJQLSortClause([
            { field: 'priority', order: data.prioritySort },
            { field: 'created', order: data.createdSort },
            { field: 'status', order: data.statusSort },
        ])

        const combinedJQL = [JQLSeparatedAndOperator, JQLSortFormat].filter(Boolean).join(' ')

        filterPUT.mutate({
            settings: {
                jqlBasic: data,
                jqlUISearchModeSwitcher: 'basic'
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
                <IssueSelect onSubmit={onSubmit} />
                <Search onSubmit={onSubmit} />
                <Projects onSubmit={onSubmit} />
                <Statuses onSubmit={onSubmit} />
                <Assignees onSubmit={onSubmit} />
                <Priority onSubmit={onSubmit} />
                <CreatedSort onSubmit={onSubmit} />
                <PrioritySort onSubmit={onSubmit} />
                <StatusSort onSubmit={onSubmit} />
                <ResetForm onSubmit={onSubmit} />
            </FormProvider>
        </Flex>
    )
}

export default memo(JQLBuilderBasicForm)
