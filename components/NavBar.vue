<template>
  <nav class="flex flex-row justify-between align-middle relative">
    <div class="flex flex-row align-middle justify-center">
      <RouterLink to="/about" :class="{ 'selected': $route.path === '/about' }">
        Om Flashy
      </RouterLink>
      <RouterLink to="/profile" :class="{ 'selected': $route.path === '/profile' }">
        Profil
      </RouterLink>
      <RouterLink to="/discover" :class="{ 'selected': $route.path === '/discover' }">
        Utforsk
      </RouterLink>
    </div>
    <img src="/images/flashyLogo.jpg" class="h-12 absolute right-4 bottom-2">
  </nav>
</template>

<style lang="scss">
nav {
  padding: 20px;

  border-bottom: 2px solid #f0f0f0;
  margin-bottom: -2px;

  .selected {
    font-weight: bold;
    color: #cf1f3c;
  }

  a {
    margin: 0 20px;
  }

  .nav-container {
    width: 100vw;
  }
}
</style>