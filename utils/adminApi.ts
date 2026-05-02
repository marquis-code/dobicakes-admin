export const useAdminApi = () => {
  const config = useRuntimeConfig();
  const token = useCookie('admin_token');

  const getHeaders = () => ({
    Authorization: token.value ? `Bearer ${token.value}` : '',
  });

  const fetchAdmin = async (url: string, options: any = {}) => {
    try {
      return await $fetch(`${config.public.apiBase}${url}`, {
        ...options,
        headers: { ...options.headers, ...getHeaders() },
      });
    } catch (error: any) {
      console.error(`Admin API Error [${url}]:`, error.data || error.message);
      throw error;
    }
  };

  const postAdmin = async (url: string, body: any) => {
    return fetchAdmin(url, { method: 'POST', body });
  };

  const patchAdmin = async (url: string, body: any) => {
    return fetchAdmin(url, { method: 'PATCH', body });
  };

  const deleteAdmin = async (url: string) => {
    return fetchAdmin(url, { method: 'DELETE' });
  };

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return fetchAdmin('/upload', { method: 'POST', body: formData });
  };

  return { fetchAdmin, postAdmin, patchAdmin, deleteAdmin, uploadImage };
};
