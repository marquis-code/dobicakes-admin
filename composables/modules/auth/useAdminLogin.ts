import { ref } from "vue"
import { auth_api } from "@/api_factory/modules/auth"
import { useAdmin } from "./admin"

export const useAdminLogin = () => {
    const loading = ref(false)
    const { setAdmin } = useAdmin()

    const login = async (payload: { email: string; password: string }) => {
        loading.value = true
        try {
            const res = await auth_api.login(payload)
            const data = res.data

            if (data.access_token && data.user.role === 'ADMIN') {
                setAdmin(data.user, data.access_token)
                return data
            }
            throw new Error('Unauthorized')
        } catch (err: any) {
            console.error('Admin login error:', err)
            return null
        } finally {
            loading.value = false
        }
    }

    return { loading, login }
}
