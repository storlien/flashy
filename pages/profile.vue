<template>
  <NavBar/>
  <div id="profile">
    <div></div>
    <div id="center-column">


      <div id="profile-left">
        <Button id="logout-button">
          <NuxtLink to="/login">Logg ut</NuxtLink>
        </Button>
        <ManageProfile id="editprofile"></ManageProfile>
      </div>



      <div class="space" :style="{ height: '10vh' }"></div>

      <div id="table-container">
        <div id="my-flashcards-header">
          <h1>Mine flashcards</h1>
          <Button type="submit">
            <NuxtLink to="/new-set">Nytt sett</NuxtLink>
          </Button>
        </div>
        <DataTable id="table" :columns="columns" :data="flashcardSets" :on-row-click="onRowClick" on />
      </div>

      <div class="space" :style="{ height: '10vh' }"></div>
    </div>
  </div>
</template>

<style lang="scss">
#profile-left {
  display: grid;
  grid-auto-columns: min-content;
  grid-auto-flow: column;
  row-gap: 10px;
  column-gap: 10px;
  justify-items: start;
  align-items: start;
}

#profile {
  display: grid;
  position: relative;

  width: 100vw;
  height: 100vh;

  grid-template-columns: 1fr 2fr 1fr;
}

#my-flashcards-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

#table-container {
  display: flex;
  flex-direction: column;

  // align-items: flex-end;
  justify-content: stretch;
  row-gap: 10px;

  #table {
    width: 100%;
  }
}
</style>

<script setup lang="ts">
import type { FlashcardSet, UserSettings } from '~/classes/models';
import { columns } from '~/classes/columns';
import server from '~/classes/server';
import ManageProfile from '@/components/flashy/ManageProfile.vue';
import { ref, watch } from 'vue'


defineComponent({
  components: {
    ManageProfile,
  },
});


definePageMeta({
  middleware: 'auth',
});

const flashcardSets = ref<FlashcardSet[]>([]);
const userSettings = ref<UserSettings | null>();

const router = useRouter();


function onRowClick(index: string) {
  const row = flashcardSets.value[parseInt(index)];
  const rowId = row.id;

  // console.log(row.id);

  router.push({ path: `/set/${rowId}` });
}

onMounted(async () => {

  const flashcardSet = ref<FlashcardSet[]>([]);
  
  userSettings.value = await server.getUserSettings();

  if (!userSettings.value) {
    userSettings.value = await server.createUserSettings();
  }

  flashcardSet.value = await server.getUserFlashcardSets();

  flashcardSet.value.sort((a, b) => {
      const isInFavoriteSetsA = userSettings.value?.favoriteSets.includes(a.id) ? -1 : 1;
      const isInFavoriteSetsB = userSettings.value?.favoriteSets.includes(b.id) ? -1 : 1;

      return (isInFavoriteSetsA - isInFavoriteSetsB);

  });

  flashcardSet.value = [...flashcardSet.value];
  

  flashcardSets.value = flashcardSet.value;

  // console.log(userSettings.value);
});
</script>
