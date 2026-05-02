import { GATEWAY_ENDPOINT } from '../axios.config'

export const auth_api = {
    login: (payload: { email: string; password: string }) => GATEWAY_ENDPOINT.post('/auth/login', payload),
    getProfile: () => GATEWAY_ENDPOINT.get('/auth/profile'),
}
