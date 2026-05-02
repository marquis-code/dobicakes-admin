import { GATEWAY_ENDPOINT } from '../axios.config'

export const marketing_api = {
    // Banners
    getBanners: () => GATEWAY_ENDPOINT.get('/marketing/banners'),
    createBanner: (payload: any) => GATEWAY_ENDPOINT.post('/marketing/banners', payload),
    updateBanner: (id: string, payload: any) => GATEWAY_ENDPOINT.patch(`/marketing/banners/${id}`, payload),
    deleteBanner: (id: string) => GATEWAY_ENDPOINT.delete(`/marketing/banners/${id}`),

    // Promos
    getPromos: () => GATEWAY_ENDPOINT.get('/marketing/promos'),
    createPromo: (payload: any) => GATEWAY_ENDPOINT.post('/marketing/promos', payload),
    updatePromo: (id: string, payload: any) => GATEWAY_ENDPOINT.patch(`/marketing/promos/${id}`, payload),
    deletePromo: (id: string) => GATEWAY_ENDPOINT.delete(`/marketing/promos/${id}`),

    // Email Marketing
    getTemplates: () => GATEWAY_ENDPOINT.get('/marketing/email-templates'),
    createTemplate: (payload: any) => GATEWAY_ENDPOINT.post('/marketing/email-templates', payload),
    getCampaigns: () => GATEWAY_ENDPOINT.get('/marketing/email-campaigns'),
    createCampaign: (payload: any) => GATEWAY_ENDPOINT.post('/marketing/email-campaigns', payload),
}
