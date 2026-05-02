export const useCloudinary = () => {
  const uploadImage = async (file: File): Promise<string> => {
    // You can replace this with your backend upload endpoint if you prefer
    // e.g. const res = await fetchAdmin('/upload', { method: 'POST', body: formData })
    
    const formData = new FormData();
    formData.append('file', file);
    // Replace 'dobi_cakes_preset' with your actual Cloudinary unsigned upload preset
    formData.append('upload_preset', 'dobi_cakes_preset');
    formData.append('cloud_name', 'marquis');

    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/marquis/image/upload', {
        method: 'POST',
        body: formData,
      });
      
      const data = await res.json();
      
      if (data.secure_url) {
        return data.secure_url;
      }
      
      throw new Error(data.error?.message || 'Upload failed');
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw error;
    }
  };

  return { uploadImage };
};
