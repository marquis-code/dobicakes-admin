export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie('admin_token');

  // Define the login page path
  const loginPath = '/login';

  // If the user is NOT authenticated and is trying to access a restricted page
  if (!token.value && to.path !== loginPath) {
    return navigateTo(loginPath);
  }

  // If the user IS authenticated and tries to access the login page
  if (token.value && to.path === loginPath) {
    return navigateTo('/admin');
  }
});
