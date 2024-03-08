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

    <!-- <div class="flex-grow" ></div> -->
    <!-- <div class="flex flex-wrap items-center justify-between mx-auto p-4">
      <button data-collapse-toggle="navbar-default" type="button"
        class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
        aria-controls="navbar-default" aria-expanded="false">
        <span class="sr-only">Open main menu</span>
        <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M1 1h15M1 7h15M1 13h15" />
        </svg>
      </button>
      <div class="hidden w-full md:block md:w-auto" id="navbar-default">
        <ul
          class="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
          <li>
            <RouterLink
              :class="{ 'text-white bg-blue-700': $route.path === '/about', 'text-gray-900 hover:bg-gray-100': $route.path !== '/about' }"
              to="/aboutFlashy" aria-current="page">Om Flashy</RouterLink>
          </li>
          <li>
            <RouterLink
              :class="{ 'text-white bg-blue-700': $route.path === '/profile', 'text-gray-900 hover:bg-gray-100': $route.path !== '/profile' }"
              to="/profile">Profil</RouterLink>
          </li>
          <li>
            <RouterLink
              :class="{ 'text-white bg-blue-700': $route.path === '/discover', 'text-gray-900 hover:bg-gray-100': $route.path !== '/discover' }"
              to="/explore">Utforsk</RouterLink>
          </li>
        </ul>
      </div>
    </div>
    <div class="logo">
      <img src="/images/flashyLogo.jpg" />
    </div> -->
  </nav>
</template>

<style scoped>
.selected {
  font-weight: bold;
  color: #cf1f3c;
}

nav {
  padding: 20px;

  border-bottom: 2px solid #f0f0f0;
  margin-bottom: -2px;
}

nav a {
  margin: 0 20px;
}

.nav-container {
  width: 100vw;
}


/* .nav-container {
  display: flex;
  align-items: center;
  height: 50px;
  margin-bottom: -2px;
  /* margin-left: 220px; */

/* justify-content: center;

border-bottom: 2px solid #f0f0f0;
} */

/* #navbar-default {
  display: flex;
  justify-content: center;
  margin: auto;
  border-radius: 10px;
  height: 30%;
  width: 150px;
  margin-bottom: 20px;
  margin-top: 30px;
  padding: 5px 10px;
  font-size: 14px;
}

.logo img {
  display: flex;
  justify-content: center;
  width: 120px;
  height: auto;
  margin-left: 120px;
} */
</style>