<template>
  <NavBar></NavBar>
  <div id="discover">
    <div></div>
    <div id="center-column">
      <div id="discover-header">
        <h1>Utforsk</h1>
      </div>
      <DiscoverSearch id="tagsearch" @update="updateFilter"></DiscoverSearch>
      <div id="table-container">
        <div id="flashcards-header">
          <h1>Flashcard sett</h1>
        </div>
        <DataTable id="table" :columns="discoverycolumns" :data="filteredSets" :on-row-click="onRowClick"
          :empty-text="emptyText" />
      </div>
    </div>
  </div>
</template>

<style scoped>
#center-column {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  row-gap: 20px;
  border: 2px solid #f0f0f0;
  padding: 20px 50px;
}

#discover {
  position: relative;
  display: grid;

  height: 100vh;
  width: 100vw;
  grid-template-columns: 1fr 2fr 1fr;
}

#discover-header {
  display: flex;

  flex-direction: row;
  justify-content: center;
  align-items: start;

  padding: 20px;

  font-size: 2em;
}

#tagsearch {
  display: flex;

  justify-content: center;
  align-items: center;
}

#table-container {
  display: flex;
  flex-direction: column;
  width: 100%;


  justify-content: stretch;
  row-gap: 10px;

  #table {
    width: 100%;

  }
}

#flashcards-header {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

#table {
  width: 100vw;
}
</style>

<script setup lang="ts">
import DiscoverSearch from '@/components/flashy/DiscoverSearch.vue';
import { discoverycolumns } from '~/classes/discovery-columns';
import type { FlashcardSet } from '~/classes/models';
import server from '~/classes/server';


definePageMeta({
  middleware: 'auth',
});

const allSets = ref<FlashcardSet[]>([]);
const filter = reactive<string[]>([]);
const emptyText = ref<string>('Laster...');

function updateFilter(newFilter: string[]) {
  filter.length = 0;
  filter.push(...newFilter);
}

// Filter by category
// TODO: Filter by tags
const filteredSets = computed(() => {
  if (filter.length === 0) return allSets.value;

  return allSets.value.filter((set) => {
    return filter.includes(set.category);
  });
});

watch(filteredSets, () => {
  if (filteredSets.value.length === 0) {
    emptyText.value = 'Ingen resultater. Legg til flere kategorier for å utvide søket.';
  } else {
    emptyText.value = 'Ingen data';
  }
});

const router = useRouter();

function onRowClick(index: string) {
  const row = filteredSets.value[parseInt(index)];
  const rowId = row.id;
  router.push({ path: `/set/${rowId}` });
}

onMounted(async () => {
  allSets.value = await server.getPublicFlashcardSets();
});
</script>