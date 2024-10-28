import React, { ReactNode, useState } from 'react'
import { useStatusesSearchGET } from 'react-app/entities/Status'
import DropdownMenu, { DropdownItemCheckbox } from '@atlaskit/dropdown-menu'
import { Box, Flex, xcss, Text } from '@atlaskit/primitives'
import { token } from '@atlaskit/tokens'
import Button from '@atlaskit/button/new'
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down'
import Badge from '@atlaskit/badge'
import Lozenge from '@atlaskit/lozenge'
import { Project, useProjectsGET } from 'react-app/entities/Projects/lib/useProjectsGET'
import Image from '@atlaskit/image'
import UserAvatarCircleIcon from '@atlaskit/icon/glyph/user-avatar-circle'

export type ProjectValue = { id: Project['id']; key: Project['key'] }

interface ProjectsDropdownProps {
    values: ProjectValue[] | undefined
    onChange: (projects: ProjectValue[]) => void
    elemAfterDropdownItems?: ReactNode
}

export const ProjectsDropdown = (props: ProjectsDropdownProps) => {
    const { values, onChange, elemAfterDropdownItems } = props
    const [opened, setOpened] = useState(false)

    const query = useProjectsGET({
        opened: opened,
    })

    return (
        <DropdownMenu
            isLoading={query.isFetching}
            trigger={
                values?.length === 0 || values === undefined
                    ? 'Project'
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
                                  Project <Badge appearance="primary">{values?.length === 1 ? values?.length : `+${values?.length}`}</Badge>
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
                query.data?.values.map((project) => {
                    return (
                        <DropdownItemCheckbox
                            onClick={() => {
                                if (values === undefined) {
                                    onChange([{ id: project.id, key: project.key }])
                                    return
                                }

                                if (values.some((p) => p.id === project.id)) {
                                    onChange(values.filter((p) => p.id !== project.id))
                                } else {
                                    onChange([...values, { id: project.id, key: project.key }])
                                }
                            }}
                            key={project.id}
                            isSelected={values?.some((p) => p.id === project.id)}
                            id={project.name}
                        >
                            <Flex columnGap="space.050">
                                {project?.avatarUrls?.['48x48'] ? (
                                    <Image
                                        height={20}
                                        width={20}
                                        src={project.avatarUrls['48x48']}
                                        loading="lazy"
                                    />
                                ) : (
                                    <Box
                                        xcss={xcss({
                                            height: '20px',
                                            width: '20px',
                                        })}
                                    >
                                        <UserAvatarCircleIcon label="Unassigned" />
                                    </Box>
                                )}
                                <Text>{project.name}</Text>
                            </Flex>
                        </DropdownItemCheckbox>
                    )
                })}
            {elemAfterDropdownItems}
        </DropdownMenu>
    )
}
