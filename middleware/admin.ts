import server from '~/classes/server';

export default defineNuxtRouteMiddleware(async (to, from) => {
    if (!server.isAdmin()) {
        navigateTo('/login');
    }
});