export const useCloudinary = () => {
  const uploadImage = async (file: File): Promise<string> => {
    const config = useRuntimeConfig();
    const token = useCookie('admin_token');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${config.public.apiBase}/chat/upload`, {
        method: 'POST',
        headers: {
          Authorization: token.value ? `Bearer ${token.value}` : '',
        },
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || `Upload failed with status ${response.status}`);
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  return { uploadImage };
};
