export interface DeepmergeOptions {
    clone?: boolean
}

export function isPlainObject(item: unknown): item is Record<keyof any, unknown> {
    return item !== null && typeof item === 'object' && item.constructor === Object
}

function deepClone<T>(source: T): T | Record<keyof any, unknown> {
    if (!isPlainObject(source)) {
        return source
    }

    const output: Record<keyof any, unknown> = {}

    Object.keys(source).forEach((key) => {
        output[key] = deepClone(source[key])
    })

    return output
}

export default function deepmerge<T>(target: T, source: unknown, options: DeepmergeOptions = { clone: true }): T {
    const output = options.clone ? { ...target } : target

    if (isPlainObject(target) && isPlainObject(source)) {
        Object.keys(source).forEach((key) => {
            if (key === '__proto__') {
                return
            }

            if (isPlainObject(source[key]) && key in target && isPlainObject(target[key])) {
                ;(output as Record<keyof any, unknown>)[key] = deepmerge(target[key], source[key], options)
            } else if (options.clone) {
                ;(output as Record<keyof any, unknown>)[key] = isPlainObject(source[key]) ? deepClone(source[key]) : source[key]
            } else {
                ;(output as Record<keyof any, unknown>)[key] = source[key]
            }
        })
    }

    return output
}
