import { useSearchParams, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useGlobalState } from '../../shared/lib/hooks/useGlobalState'

const GlobalStateUrlSync = () => {
    const [, setSearchParams] = useSearchParams()
    const location = useLocation()

    const type = useGlobalState((state) => state.issueIdsSearchParams.type)
    const value = useGlobalState((state) => state.issueIdsSearchParams.value)

    useEffect(() => {
        setSearchParams((prev) => {
            switch (type) {
                case 'add': {
                    let string = value
                    for (const value of prev.values()) {
                        if (value) {
                            string += `,${value}`
                        }
                    }

                    return { ids: string }
                }

                case 'delete': {
                    const ids = prev.get('ids')

                    if (ids) {
                        const numbers = ids
                            .split(',')
                            .map((item) => {
                                return parseInt(item, 10)
                            })
                            .filter(Boolean)

                        const indexToRemove = numbers.indexOf(Number(value))

                        if (indexToRemove !== -1) {
                            numbers.splice(indexToRemove, 1)
                        }

                        return {
                            ids: numbers.join(','),
                        }
                    } else {
                        return {
                            ids: '',
                        }
                    }
                }

                default: {
                    return prev
                }
            }
        })
    }, [type, value])

    useEffect(() => {
        useGlobalState.getState().setIssueIdsSearchParams(new URLSearchParams(location.search).get('ids') ?? '')
    }, [location.search])

    return null
}

export default GlobalStateUrlSync
