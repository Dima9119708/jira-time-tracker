import { Box, Flex, xcss } from '@atlaskit/primitives'
import Toggle from '@atlaskit/toggle'
import { Label } from '@atlaskit/form'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useSetColorMode } from '@atlaskit/app-provider'
import { Outlet } from 'react-router-dom'
import { electron } from 'react-app/shared/lib/electron/electron'
import MediaServicesZoomInIcon from '@atlaskit/icon/glyph/media-services/zoom-in'
import MediaServicesZoomOutIcon from '@atlaskit/icon/glyph/media-services/zoom-out'
import { IconButton } from '@atlaskit/button/new'
import Textfield from '@atlaskit/textfield'
import Badge from '@atlaskit/badge'

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
const DEFAULT_ZOOM = electron<number>((methods) => methods.ipcRenderer.sendSync('GET_ZOOM'))

const TopPanel = () => {
    const [isChecked, setIsChecked] = useState(DEFAULT_COLOR_MODE === 'dark')
    const [zoom, setZoom] = useState<number>(DEFAULT_ZOOM)
    const setColorMode = useSetColorMode()

    const zoomIntervalTimeout = useRef<NodeJS.Timeout>()

    const onToggleColorMode = useCallback(() => {
        const theme = !isChecked ? 'dark' : 'light'

        setIsChecked((prev) => !prev)

        setColorMode(theme)

        electron((methods) => {
            methods.ipcRenderer.send('SET_THEME', theme)
        })
    }, [isChecked])

    const onZoomInStart = useCallback(() => {
        zoomIntervalTimeout.current = setInterval(() => {
            setZoom((prevState) => prevState + 0.01)
        }, 50)
    }, [])

    const onZoomOutStart = useCallback(() => {
        zoomIntervalTimeout.current = setInterval(() => {
            setZoom((prevState) => prevState - 0.01)
        }, 50)
    }, [])

    const onZoomStop = useCallback(() => {
        clearInterval(zoomIntervalTimeout.current)
    }, [zoom])

    useEffect(() => {
        if (zoom !== DEFAULT_ZOOM) {
            electron((methods) => {
                methods.ipcRenderer.send('SET_ZOOM', zoom)
            })
        }
    }, [zoom])

    return (
        <>
            <Flex
                columnGap="space.200"
                justifyContent="center"
                xcss={styles.wrap}
            >
                <Flex alignItems="center">
                    <Label htmlFor="dark-theme">Dark theme</Label>
                    <Toggle
                        id="dark-theme"
                        isChecked={isChecked}
                        onChange={onToggleColorMode}
                    />
                </Flex>

                <Flex
                    columnGap="space.100"
                    alignItems="center"
                >
                    <IconButton
                        icon={MediaServicesZoomInIcon}
                        label="zoom in"
                        onMouseDown={onZoomInStart}
                        onMouseUp={onZoomStop}
                        onMouseLeave={onZoomStop}
                    />
                    <Badge>{String(zoom).substring(0, 4)}</Badge>

                    <IconButton
                        icon={MediaServicesZoomOutIcon}
                        label="zoom out"
                        onMouseDown={onZoomOutStart}
                        onMouseUp={onZoomStop}
                        onMouseLeave={onZoomStop}
                    />
                </Flex>
            </Flex>

            <Outlet />
        </>
    )
}

export default TopPanel
