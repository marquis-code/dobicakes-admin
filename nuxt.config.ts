// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/css/main.css'],
  devServer: {
    port: 3001
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:4000',
    }
  },
  imports: {
    dirs: ['composables/**', 'utils/**']
  },
  experimental: {
    appManifest: false,
  },
  vite: {
    server: {
      hmr: {
        overlay: false
      }
    }
  },
  app: {
    head: {
      title: 'Adaobi Cakes | Admin Dashboard',
      link: [
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap' }
      ]
    }
  }
})
