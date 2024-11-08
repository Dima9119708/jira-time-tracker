import { Box, xcss, Text } from '@atlaskit/primitives'
import { useGlobalState } from 'react-app/shared/lib/hooks/useGlobalState'

const TimeFormatGuide = () => {
    const workingDaysPerWeek = useGlobalState((state) => state.settings.workingDaysPerWeek)
    const workingHoursPerDay = useGlobalState((state) => state.settings.workingHoursPerDay)

    return (
        <Box xcss={xcss({ marginBottom: 'space.100' })}>
            <Text>Use the format: 2w 3d 4h 5m</Text>
            <ul>
                <li><strong>w</strong> = weeks</li>
                <li><strong>d</strong> = days</li>
                <li><strong>h</strong> = hours</li>
                <li><strong>m</strong> = minutes</li>
            </ul>
            <Text size="small" color="color.text.accent.gray">
                📅 Workweek: {workingDaysPerWeek} days, 🕒 {workingHoursPerDay} hours per day.
            </Text>
        </Box>
    );
};

export default TimeFormatGuide;
