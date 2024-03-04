<script setup lang="ts">
// definePageMeta({
//     middleware: 'auth',
// });

import server from '@/classes/server';

const router = useRouter();

onMounted(async () => {
    if (await server.auth.isLoggedIn()) {
        router.push({ name: 'profile' });
    } else {
        router.push({ name: 'login' });
    }
});
</script>

<template></template>

<style lang="scss">
.a {}
</style>