import server from '~/classes/server';

export default defineNuxtRouteMiddleware((to, from) => {
    if (!server.auth.credentials) {
      return navigateTo('/login')
    }
  });