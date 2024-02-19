<template>
  <!-- <div :style="{height: '25vh'}"></div> -->
  <div id="profile">
    <Button id="logout-button">
      <NuxtLink to="/login">Logg ut</NuxtLink>
    </Button>
    <div :style="{height: '20vh'}"></div>
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
import type { FlashcardSet } from '~/classes/columns';
import { columns } from '~/classes/columns';

definePageMeta({
  middleware: 'auth',
});

const data = ref<FlashcardSet[]>([]);

function onRowClick(id: string) {
  alert(id);
}

async function getData(): Promise<FlashcardSet[]> {
  // Fetch data from your API here.
  return [
    {
      id: "0nkrqzsse7",
      name: 'Diskré Matematikk',
      cards: 23,
      category: 'Matte',
      creator: 'Erlend',
    },
    {
      id: "amh856vgey",
      name: 'Vue 101',
      cards: 15,
      category: 'Frontend',
      creator: 'Edward',
    },
    {
      id: "1mg75gdhcy",
      name: 'CSS For Nybegynnere',
      cards: 19,
      category: 'Design',
      creator: 'Silje',
    },
  ]
}

onMounted(async () => {
  data.value = await getData();
});
</script>../classes/columns../classes/columns