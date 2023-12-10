export interface Boards {
    values: Array<{
        id: number
        name: string
        location: {
            avatarURI: string
        }
    }>
}
