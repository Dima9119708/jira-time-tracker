import Button from '@atlaskit/button/new'
import { Flex } from '@atlaskit/primitives'
import { FunctionComponent, memo, useState } from 'react'

type ActivityFeed = 'Linked issues' | 'Child issues' | false

interface IssueActivityFeedProps {
    children: FunctionComponent<{ activityFeed: ActivityFeed }>
    isShowLinkedIssues: boolean
    isShowChildIssues: boolean
    countLinkedIssues: number
    countChildIssues: number
}

const IssueActivityFeedUIButtons = (props: IssueActivityFeedProps) => {
    const { isShowLinkedIssues, isShowChildIssues, countLinkedIssues, countChildIssues } = props
    const [activityFeed, setActive] = useState<ActivityFeed>(false)

    return !isShowLinkedIssues && !isShowChildIssues ? null : (
        <>
            <Flex columnGap="space.100">
                {isShowLinkedIssues && (
                    <Button
                        spacing="compact"
                        isSelected={activityFeed === 'Linked issues'}
                        onClick={() => setActive((prevState) => (prevState === 'Linked issues' ? false : 'Linked issues'))}
                    >
                        Linked issues ({countLinkedIssues})
                    </Button>
                )}

                {isShowChildIssues && (
                    <Button
                        spacing="compact"
                        isSelected={activityFeed === 'Child issues'}
                        onClick={() => setActive((prevState) => (prevState === 'Child issues' ? false : 'Child issues'))}
                    >
                        Child issues ({countChildIssues})
                    </Button>
                )}
            </Flex>

            {props.children({ activityFeed })}
        </>
    )
}

export default memo(IssueActivityFeedUIButtons)
