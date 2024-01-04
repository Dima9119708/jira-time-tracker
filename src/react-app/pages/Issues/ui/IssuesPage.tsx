import { Title } from '@mantine/core'
import LoadMore from './LoadMore'
import { Filter } from '../../../features/Filter'
import IssuesTracking from './IssuesTracking'
import Issues from './Issues'
import { useSearchParams } from 'react-router-dom'
import { useGlobalState } from '../../../shared/lib/hooks/useGlobalState'
import { useEffect } from 'react'

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
