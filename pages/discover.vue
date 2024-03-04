<template>
    <div id="discover">
        <div></div>
        <div class="center-column">
            <div id="discover-header">
                <h1>Utforsk</h1>
            </div>
            <DiscoverSearch id="tagsearch"></DiscoverSearch>
            <div id="table-container">
                <div id="flashcards-header">
                    <h1>Flashcard sett</h1>
                </div>
                <DataTable id="table" :columns="columns" :data="data" :on-row-click="onRowClick" on />  
            </div>
        </div>
    </div>
</template>

<style>
.center-column {
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    row-gap: 20px;
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
}

#flashcards-header {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}

#table {
    width: 100%;
}
</style>

<script setup lang="ts">
import DiscoverSearch from '@/components/flashy/DiscoverSearch.vue';
import { columns } from '~/classes/discovery-columns';
import type { FlashcardSet } from '~/classes/models';
import server from '~/classes/server';

definePageMeta({
  middleware: 'auth',
});

const data = ref<FlashcardSet[]>([]);

const router = useRouter();

function onRowClick(index: string) {
  const row = data.value[parseInt(index)];
  const rowId = row.id;
  router.push({ path: `/set/${rowId}`});
}

onMounted(async () => {
  data.value = await server.getPublicFlashcardSets();
});

</script>