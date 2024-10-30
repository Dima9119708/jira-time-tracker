import FavoriteButton from 'react-app/widgets/FavoriteList/ui/FavoriteButton'
import { lazy } from 'react'

const FavoriteListLazy = lazy(() => import('./ui/FavoriteList'))

export { FavoriteButton, FavoriteListLazy }
