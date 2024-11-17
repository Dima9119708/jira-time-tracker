import { useMemo } from 'react'
import { xcss } from '@atlaskit/primitives'
import { token } from '@atlaskit/tokens'
import { Issue } from 'react-app/shared/types/Jira/Issues'

export const useStatusStyles = (fields: Issue['fields']) => {
    return useMemo(() => {
        const colorNew = fields.status.statusCategory.key === 'new' && 'default'
        const colorIndeterminate = fields.status.statusCategory.key === 'indeterminate' && 'primary'
        const colorDone = fields.status.statusCategory.key === 'done' && 'subtle'

        return {
            STATUTES_DROPDOWN_BUTTON: xcss({
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
        }
    }, [fields.status.name])
}
