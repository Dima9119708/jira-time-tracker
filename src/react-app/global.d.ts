declare const __BASE_APP_ROUTE__: string
declare const __BUILD_ENV__: 'browser' | 'electron'
declare const __BASE_URL__: string

declare module '*.svg' {
    import { FC, SVGProps } from 'react'
    const content: FC<SVGProps<SVGElement>>
    export default content
}

declare module '*.png'
declare module '*.mp3';
declare module '*.wav';
