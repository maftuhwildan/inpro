import { logout } from './actions'

export default function LogoutRoute() {
    return null
}

export async function POST() {
    await logout()
}
