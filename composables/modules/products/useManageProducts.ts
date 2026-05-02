import { ref } from "vue"
import { product_api } from "@/api_factory/modules/products"

export const useManageProducts = () => {
    const products = ref([])
    const loading = ref(false)

    const fetchProducts = async (params?: any) => {
        loading.value = true
        try {
            const res = await product_api.getAll(params)
            products.value = res.data
        } catch (err) {
            console.error('Admin fetch products error:', err)
        } finally {
            loading.value = false
        }
    }

    const createProduct = async (payload: any) => {
        loading.value = true
        try {
            const res = await product_api.create(payload)
            return res.data
        } catch (err) {
            console.error('Admin create product error:', err)
            return null
        } finally {
            loading.value = false
        }
    }

    const deleteProduct = async (id: string) => {
        loading.value = true
        try {
            await product_api.delete(id)
            products.value = products.value.filter((p: any) => p._id !== id)
            return true
        } catch (err) {
            console.error('Admin delete product error:', err)
            return false
        } finally {
            loading.value = false
        }
    }

    return { products, loading, fetchProducts, createProduct, deleteProduct }
}
