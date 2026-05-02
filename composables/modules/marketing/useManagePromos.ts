import { ref } from "vue"
import { marketing_api } from "@/api_factory/modules/marketing"

export const useManagePromos = () => {
    const promos = ref([])
    const loading = ref(false)

    const fetchPromos = async () => {
        loading.value = true
        try {
            const res = await marketing_api.getPromos()
            promos.value = res.data
        } catch (err) {
            console.error('Admin fetch promos error:', err)
        } finally {
            loading.value = false
        }
    }

    const createPromo = async (payload: any) => {
        loading.value = true
        try {
            const res = await marketing_api.createPromo(payload)
            promos.value.unshift(res.data)
            return res.data
        } catch (err) {
            console.error('Admin create promo error:', err)
            return null
        } finally {
            loading.value = false
        }
    }

    return { promos, loading, fetchPromos, createPromo }
}
