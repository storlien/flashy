<template>
  <NavBar/>
  <div id="profile">
    <div></div>
    <div id="center-column">
      <div class="space" :style="{ height: '10vh' }"></div>
      
      <div id="table-container2">
    <div id="my-flashcards-header">
      <h1>Mine egne flashcardsett</h1>
      <Button type="submit" @click="$router.push('/new-set')">
        Nytt sett
      </Button>
    </div>
    <DataTable id="table2" :columns="columns" :data="flashcardSets" :on-row-click="onRowClick" :empty-text="emptyText"/>  
  </div>

  <div class="space" :style="{ height: '10vh' }"></div>


      <div id="table-container">
        <div id="my-flashcards-header">
          <h1>Favorittsett</h1>
        </div>
        <DataTable id="table" :columns="discoverycolumns" :data="favoriteflashcardSets" :on-row-click="onRowClick" :empty-text="emptyText"/>  
      </div>

      <div class="space" :style="{ height: '10vh' }"></div>
   

    </div>
</div>
   
    
</template>

<style lang="scss">

#center-column {
  border: 2px solid #f0f0f0;
  padding: 20px 50px;
}

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

#table-container2 {
  display: flex;
  flex-direction: column;

  // align-items: flex-end;
  justify-content: stretch;
  row-gap: 10px;

  #table2 {
    width: 100%;
    
  }
}
</style>

<script setup lang="ts">
import type { FlashcardSet, UserSettings } from '~/classes/models';
import { columns } from '~/classes/columns';
import { discoverycolumns } from '~/classes/discovery-columns';
import server from '~/classes/server';
import ManageProfile from '@/components/flashy/ManageProfile.vue';
import { ref, watch } from 'vue'



async function logout() {
  router.push('/login');
  await server.auth.logout();
}

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
const favoriteflashcardSets = ref<FlashcardSet[]>([])
const emptyText = ref<string>('Laster...');
const router = useRouter();


function onRowClick(index: string) {
  const row = flashcardSets.value[parseInt(index)];
  const rowId = row.id;

  // console.log(row.id);

  router.push({ path: `/set/${rowId}` });
}



watch(flashcardSets, () => {
  emptyText.value = 'Du har ikke laget noen sett';
});

watch(favoriteflashcardSets, () => {
  emptyText.value = 'Du har ingen favorittsett';
});

onMounted(async () => {

  const flashcardSet = ref<FlashcardSet[]>([]);
  
  userSettings.value = await server.getUserSettings();

  if (!userSettings.value) {
    userSettings.value = await server.createUserSettings();
  }
  flashcardSet.value = await server.getUserFlashcardSets();
  flashcardSets.value = flashcardSet.value;

  

  const favoriteflashcardSet = ref<FlashcardSet[]>([])

  favoriteflashcardSet.value = await server.getPublicFlashcardSets()

  favoriteflashcardSet.value = favoriteflashcardSet.value.filter(set => {
    userSettings.value?.favoriteSets.includes(set.id);
  });

  favoriteflashcardSets.value = favoriteflashcardSet.value
    

  // console.log(userSettings.value);
  
});


// onMounted(async () => {

// const flashcardSet = ref<FlashcardSet[]>([]);

// userSettings.value = await server.getUserSettings();

// if (!userSettings.value) {
//   userSettings.value = await server.createUserSettings();
// }

// flashcardSet.value = await server.getUserFlashcardSets();

// flashcardSet.value.sort((a, b) => {
//     const isInFavoriteSetsA = userSettings.value?.favoriteSets.includes(a.id) ? -1 : 1;
//     const isInFavoriteSetsB = userSettings.value?.favoriteSets.includes(b.id) ? -1 : 1;

//     return (isInFavoriteSetsA - isInFavoriteSetsB);

// });

// flashcardSet.value = [...flashcardSet.value];


// flashcardSets.value = flashcardSet.value;

// // console.log(userSettings.value);
// });

</script>