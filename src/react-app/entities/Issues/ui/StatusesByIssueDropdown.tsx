import { useMemo, useState } from 'react'
import { StatusesByIssueDropdownProps } from 'react-app/entities/Issues/types/types'
import Lozenge from '@atlaskit/lozenge'
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu'
import { Box, xcss } from '@atlaskit/primitives'
import { token } from '@atlaskit/tokens'
import { useStatutesByIssueGET } from 'react-app/entities/Issues/api/useStatutesByIssueGET'

const StatusesByIssueDropdown = (props: StatusesByIssueDropdownProps) => {
    const { issueId, onChange, trigger, status, position = 'bottom-start', disabled } = props
    const [open, setOpen] = useState(false)

    const { data, isLoading } = useStatutesByIssueGET({
        issueId,
        open,
    })

    const styles = useMemo(() => {
        const colorNew = status.statusCategory.key === 'new' && 'default'
        const colorIndeterminate = status.statusCategory.key === 'indeterminate' && 'primary'
        const colorDone = status.statusCategory.key === 'done' && 'subtle'

        return xcss({
            // @ts-ignore
            '& > button': {
                fontWeight: token('font.weight.semibold'),
                ...(colorNew && {
                    backgroundColor: token('color.background.neutral'),
                    color: token('color.text'),
                }),
                ...(colorIndeterminate && {
                    backgroundColor: token('color.background.information.bold'),
                    color: token('color.text.inverse'),
                }),
                ...(colorDone && {
                    backgroundColor: token('color.chart.success.bold'),
                    color: token('color.text.inverse'),
                }),
            },
            '& > button:hover': {
                ...(colorNew && {
                    backgroundColor: token('color.background.neutral.hovered'),
                    color: token('color.text'),
                }),
                ...(colorIndeterminate && {
                    backgroundColor: token('color.background.information.bold.hovered'),
                    color: token('color.text.inverse'),
                }),
                ...(colorDone && {
                    backgroundColor: token('color.chart.success.bold.hovered'),
                    color: token('color.text.inverse'),
                }),
            },
        })
    }, [status.name])

    return (
        <Box xcss={styles}>
            <DropdownMenu
                isLoading={isLoading}
                isOpen={disabled === true ? false : open}
                onOpenChange={() => setOpen(!open)}
                placement={position}
                trigger={trigger}
            >
                <DropdownItemGroup>
                    {!isLoading &&
                        data?.transitions.map((transition) => {
                            const colorNew = transition.to.statusCategory.key === 'new' && 'default'
                            const colorIndeterminate = transition.to.statusCategory.key === 'indeterminate' && 'inprogress'
                            const colorDone = transition.to.statusCategory.key === 'done' && 'success'
                            const appearance = colorNew || colorIndeterminate || colorDone || 'default'

                            return (
                                <DropdownItem
                                    onClick={() => onChange(transition)}
                                    key={transition.id}
                                    isSelected={status.id === transition.to.id}
                                >
                                    <Lozenge appearance={appearance}>{transition.name}</Lozenge>
                                </DropdownItem>
                            )
                        })}
                </DropdownItemGroup>
            </DropdownMenu>
        </Box>
    )
}

export default StatusesByIssueDropdown
