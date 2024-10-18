import { Flex, xcss } from '@atlaskit/primitives'
import Toggle from '@atlaskit/toggle'
import { Label } from '@atlaskit/form'
import { useState } from 'react'
import { useSetColorMode } from '@atlaskit/app-provider'
import { Outlet } from 'react-router-dom'
import { electron } from 'react-app/shared/lib/electron/electron'

export const TOP_PANEL_HEIGHT = '36px'

const styles = {
    wrap: xcss({
        position: 'sticky',
        top: '0',
        left: '0',
        height: TOP_PANEL_HEIGHT,
        borderBottomWidth: '3px',
        borderBottomStyle: 'solid',
        borderColor: 'color.border.accent.gray',
        backgroundColor: 'color.background.input',
        zIndex: 'tooltip',

        //@ts-ignore
        '& label': {
            marginBottom: 0,
        },
    }),
}

const DEFAULT_COLOR_MODE = electron((methods) => methods.ipcRenderer.sendSync('GET_THEME'))

const TopPanel = () => {
    const [isChecked, setIsChecked] = useState(DEFAULT_COLOR_MODE === 'dark')
    const setColorMode = useSetColorMode()

    return (
        <>
            <Flex
                justifyContent="center"
                xcss={styles.wrap}
            >
                <Flex alignItems="center">
                    <Label htmlFor="dark-theme">Dark theme</Label>
                    <Toggle
                        id="dark-theme"
                        isChecked={isChecked}
                        onChange={() => {
                            const theme = !isChecked ? 'dark' : 'light'

                            setIsChecked((prev) => !prev)

                            setColorMode(theme)
                            electron((methods) => {
                                methods.ipcRenderer.send('SET_THEME', theme)
                            })
                        }}
                    />
                </Flex>
            </Flex>

            <Outlet />
        </>
    )
}

export default TopPanel
