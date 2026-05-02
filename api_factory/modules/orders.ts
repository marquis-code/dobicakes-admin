import { GATEWAY_ENDPOINT } from '../axios.config'

export const order_api = {
    getAll: (params?: any) => GATEWAY_ENDPOINT.get('/orders', { params }),
    getById: (id: string) => GATEWAY_ENDPOINT.get(`/orders/${id}`),
    updateStatus: (id: string, status: string) => GATEWAY_ENDPOINT.patch(`/orders/${id}/status`, { status }),
}
