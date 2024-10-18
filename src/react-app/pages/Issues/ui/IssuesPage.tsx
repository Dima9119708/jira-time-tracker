import LoadMore from './LoadMore'
import { Filter } from '../../../features/Filter'
import IssuesTracking from './IssuesTracking'
import Issues from './Issues'
import { Box, xcss } from '@atlaskit/primitives'
import Heading from '@atlaskit/heading'

const IssuesPage = () => {
    return (
        <>
            <Box xcss={xcss({ marginBottom: 'space.100' })}>
                <Heading size="xlarge">Issues</Heading>
            </Box>

            <Filter />

            <IssuesTracking />

            <Issues />

            <LoadMore />
        </>
    )
}

export default IssuesPage
