<template>
  <nav class="flex flex-row justify-between align-middle relative">
    <img src="/images/flashyLogo.jpg" class="h-12 absolute left-4 bottom-2">
    <div class="flex flex-row align-middle justify-center ml-32">
      <RouterLink to="/about" :class="{ 'selected': $route.path === '/about' }" class="centered-text">
        Om Flashy
      </RouterLink>
      <RouterLink to="/profile" :class="{ 'selected': $route.path === '/profile' }" class="centered-text">
        Min Side
      </RouterLink>
      <RouterLink to="/discover" :class="{ 'selected': $route.path === '/discover' }" class="centered-text">
        Utforsk
      </RouterLink>
      <RouterLink v-if="isAdmin" to="/admin" :class="{ 'selected': $route.path === '/admin' }" class="centered-text">
        Admin
      </RouterLink>
    </div>
    <ManageProfile></ManageProfile>
  </nav>
</template>

<style lang="scss">
nav {
  padding: 12px;
  border-bottom: 2px solid #f0f0f0;
  margin-bottom: -2px;

  .selected {
    font-weight: bold;
    color: #dd1d4a;
  }

  a {
    margin: 0 20px;
  }

  .nav-container {
    width: 100vw;
  }

  .centered-text {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>

<script setup lang="ts">
import server from '~/classes/server';
import ManageProfile from './flashy/ManageProfile.vue';

const isAdmin = ref(false);

onMounted(async () => {
  isAdmin.value = await server.isAdmin();
})


</script>