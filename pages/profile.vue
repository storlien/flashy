<template>
  <!-- <div :style="{height: '25vh'}"></div> -->
  <div id="profile">
    <Button id="logout-button">
      <NuxtLink to="/login">Logg ut</NuxtLink>
    </Button>
    <div :style="{ height: '20vh' }"></div>
    <div id="table-container">
      <Button type="submit">
        <NuxtLink to="/new-set">Nytt Sett</NuxtLink>
      </Button>
      <DataTable id="table" :columns="columns" :data="data" :on-row-click="onRowClick" on />
    </div>
  </div>
</template>
  
<style lang="scss">
#profile {
  padding: 10vh 25vw;
}

#logout-button {
  position: absolute;
  top: 10px;
  left: 10px;
}

#table-container {

  display: flex;
  flex-direction: column;

  align-items: end;
  justify-content: stretch;
  row-gap: 10px;

  #table {
    width: 100%;
  }
}
</style>
  
<script setup lang="ts">
import type { FlashcardSet } from '~/classes/models';
import { columns } from '~/classes/columns';
import server from '~/classes/server';

definePageMeta({
  middleware: 'auth',
});

const data = ref<FlashcardSet[]>([]);

function onRowClick(id: string) {
  alert(id);
}

async function getData(): Promise<FlashcardSet[]> {

  return server.retrieveFlashcardSets();
}

onMounted(async () => {
  data.value = await getData();
});
</script>../classes/columns../classes/columns