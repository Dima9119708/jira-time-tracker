export interface Comment {
    type: string
    version?: number
    attrs?: Record<string, unknown>
    content?: Comment[]
}

export const extractTextFromDoc = (node: Comment | undefined): string => {
    if (node === undefined) {
        return ''
    }

    let result = ''

    if (node.type === 'text' && 'text' in node) {
        result += ` ${node.text}`
    }

    if (node.content) {
        node.content.forEach((childNode) => {
            result += extractTextFromDoc(childNode)
        })
    }

    return result
}
