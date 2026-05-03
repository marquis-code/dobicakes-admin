export const useAdminAuth = () => {
  const admin = useState('admin', () => null);
  const token = useCookie('admin_token');
  const { fetchAdmin } = useAdminApi();

  const login = async (credentials: any) => {
    const response: any = await fetchAdmin('/auth/login', {
      method: 'POST',
      body: credentials,
    });
    
    if (response.user.role !== 'ADMIN') {
      throw new Error('Unauthorized: Admin access only');
    }

    admin.value = response.user;
    token.value = response.access_token;
    return response;
  };

  const logout = () => {
    admin.value = null;
    token.value = null;
    navigateTo('/login');
  };

  const fetchProfile = async () => {
    if (!token.value) return;
    try {
      const response: any = await fetchAdmin('/auth/profile');
      admin.value = response;
    } catch (e) {
      logout();
    }
  };

  return {
    admin,
    token,
    login,
    logout,
    fetchProfile,
    isLoggedIn: computed(() => !!admin.value),
  };
};
