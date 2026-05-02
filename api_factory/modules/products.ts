import { GATEWAY_ENDPOINT } from '../axios.config'

export const product_api = {
    getAll: (params?: any) => GATEWAY_ENDPOINT.get('/products', { params }),
    getById: (id: string) => GATEWAY_ENDPOINT.get(`/products/${id}`),
    create: (payload: any) => GATEWAY_ENDPOINT.post('/products', payload),
    update: (id: string, payload: any) => GATEWAY_ENDPOINT.patch(`/products/${id}`, payload),
    delete: (id: string) => GATEWAY_ENDPOINT.delete(`/products/${id}`),
}
