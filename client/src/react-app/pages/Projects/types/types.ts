export interface Projects {
    expand: string
    self: string
    id: string
    key: string
    name: string
    avatarUrls: {
        '48x48': string
        '24x24': string
        '16x16': string
        '32x32': string
    }
}

export interface CardProps {
    src: string
    name: string
    id: string
}
