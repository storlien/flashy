import server from '~/classes/server';

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (!await server.auth.isLoggedIn()) {
    return navigateTo('/login')
  }
});