import { goto } from '$app/navigation'
import type { Pathname, RouteId } from '$app/types'

export const safeGoto = (url: Pathname) => goto(url)
