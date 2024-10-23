import DropdownMenu, { DropdownItem, DropdownItemCheckbox } from '@atlaskit/dropdown-menu'
import { useStatusesSearch } from 'react-app/entities/Status'
import Lozenge from '@atlaskit/lozenge'
import { ReactNode, useState } from 'react'
import Button from '@atlaskit/button/new'
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down'
import Badge from '@atlaskit/badge'
import { Box, xcss } from '@atlaskit/primitives'
import { token } from '@atlaskit/tokens'

interface StatusesDropdownProps {
    values: string[] | undefined
    projectIds?: string[]
    onChange: (statuses: string[]) => void
    elemAfterDropdownItems?: ReactNode
}

const StatusesDropdown = (props: StatusesDropdownProps) => {
    const { projectIds = [], values, onChange, elemAfterDropdownItems } = props
    const [opened, setOpened] = useState(false)

    const query = useStatusesSearch({
        projectIds: projectIds,
        opened: opened,
    })

    return (
        <DropdownMenu
            isLoading={query.isFetching}
            trigger={
                values?.length === 0 || values === undefined
                    ? 'Status'
                    : (triggerButtonProps) => (
                          <Box
                              xcss={xcss({
                                  // @ts-ignore
                                  '& > button, & > button:hover': {
                                      backgroundColor: token('color.background.selected'),
                                      color: token('color.text.selected'),
                                  },
                              })}
                          >
                              <Button
                                  {...triggerButtonProps}
                                  ref={triggerButtonProps.triggerRef}
                                  iconAfter={ChevronDownIcon}
                              >
                                  Status <Badge appearance="primary">{values?.length === 1 ? values?.length : `+${values?.length}`}</Badge>
                              </Button>
                          </Box>
                      )
            }
            shouldRenderToParent
            isOpen={opened}
            onOpenChange={() => {
                setOpened(!opened)
            }}
        >
            {!query.isLoading &&
                query.data?.values.map((status) => {
                    const colorNew = status.statusCategory === 'TODO' && 'default'
                    const colorIndeterminate = status.statusCategory === 'IN_PROGRESS' && 'inprogress'
                    const colorDone = status.statusCategory === 'DONE' && 'success'
                    const appearance = colorNew || colorIndeterminate || colorDone || 'default'

                    return (
                        <DropdownItemCheckbox
                            onClick={() => {
                                if (values === undefined) {
                                    onChange([status.name])
                                    return
                                }

                                if (values.includes(status.name)) {
                                    onChange(values.filter((value) => value !== status.name))
                                } else {
                                    onChange([...values, status.name])
                                }
                            }}
                            key={status.id}
                            isSelected={values?.includes(status.name)}
                            id={status.name}
                        >
                            <Lozenge appearance={appearance}>{status.name}</Lozenge>
                        </DropdownItemCheckbox>
                    )
                })}

            {elemAfterDropdownItems}
        </DropdownMenu>
    )
}

export default StatusesDropdown
