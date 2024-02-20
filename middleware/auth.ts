import server from '~/classes/server';

export default defineNuxtRouteMiddleware((to, from) => {
    if (!server.auth.isLoggedIn()) {
      return navigateTo('/login')
    }
  });