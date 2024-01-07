import { Title } from '@mantine/core'
import LoadMore from './LoadMore'
import { Filter } from '../../../features/Filter'
import IssuesTracking from './IssuesTracking'
import Issues from './Issues'

const IssuesPage = () => {
    return (
        <>
            <Title
                mb={10}
                order={2}
            >
                Issues
            </Title>

            <Filter />

            <IssuesTracking />

            <Issues />

            <LoadMore />
        </>
    )
}

export default IssuesPage
