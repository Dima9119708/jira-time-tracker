import LoadMore from './LoadMore'
import { JQLEditor } from '../../../features/JQLEditor'
import IssuesTracking from './IssuesTracking'
import Issues from './Issues'
import { Flex, xcss } from '@atlaskit/primitives'
import Heading from '@atlaskit/heading'
import { JQLBuilderBasicForm } from 'react-app/widgets/JQLBuilderBasic'
import { Radio } from '@atlaskit/radio'
import { useGlobalState } from 'react-app/shared/lib/hooks/useGlobalState'

const IssuesPage = () => {
    const jqlUISearchModeSwitcher = useGlobalState((state) => state.settings.jqlUISearchModeSwitcher)

    return (
        <>
            <Flex xcss={xcss({ marginBottom: 'space.100', justifyContent: 'space-between' })}>
                <Heading size="xlarge">Issues</Heading>

                <Flex columnGap="space.050">
                    <Radio
                        value="BASIC"
                        label="BASIC"
                        name="basic"
                        testId="radio-default"
                        isChecked={jqlUISearchModeSwitcher === 'basic'}
                        onChange={useGlobalState.getState().setSearchModeSwitcherBasic}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                    />
                    <Radio
                        value="JQL"
                        label="JQL"
                        name="jql"
                        testId="radio-disabled"
                        isChecked={jqlUISearchModeSwitcher === 'jql'}
                        onChange={useGlobalState.getState().setSearchModeSwitcherJQL}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                    />
                </Flex>
            </Flex>

            {jqlUISearchModeSwitcher === 'jql' ? <JQLEditor /> : <JQLBuilderBasicForm />}

            <IssuesTracking />

            <Issues />

            <LoadMore />
        </>
    )
}

export default IssuesPage
