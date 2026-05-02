import { ref, computed } from "vue"

export const useAdmin = () => {
    const admin = useState('admin', () => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('admin')
            return stored ? JSON.parse(stored) : null
        }
        return null
    })

    const token = useState('admin_token', () => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('admin_token')
        }
        return null
    })

    const isLoggedIn = computed(() => !!token.value)

    const setAdmin = (adminData: any, adminToken?: string) => {
        admin.value = adminData
        if (adminToken) token.value = adminToken
        
        if (typeof window !== 'undefined') {
            localStorage.setItem('admin', JSON.stringify(adminData))
            if (adminToken) localStorage.setItem('admin_token', adminToken)
        }
    }

    const logOut = () => {
        admin.value = null
        token.value = null
        if (typeof window !== 'undefined') {
            localStorage.removeItem('admin')
            localStorage.removeItem('admin_token')
            window.location.href = '/login'
        }
    }

    return { admin, token, isLoggedIn, setAdmin, logOut }
}
