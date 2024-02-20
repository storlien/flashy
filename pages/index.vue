<script setup lang="ts">
definePageMeta({
    middleware: 'auth',
});

import server from '~/classes/server';

server.retrieveFlashcardSets();

</script>

<template></template>

<style lang="scss">
.a {}
</style>