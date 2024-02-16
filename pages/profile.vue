<template>
    <!-- <div :style="{height: '25vh'}"></div> -->
    <div id="table-container">
      <Button type="submit"><NuxtLink to="/new-set">Nytt Sett</NuxtLink></Button>
      <DataTable id="table" :columns="columns" :data="data" :on-row-click="onRowClick" on/>
    </div>
  </template>
  
  <style lang="scss">
  #table-container {
    padding: 10vh 25vw;
  
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
  import type { FlashcardSet } from './profile/columns';
  import { columns } from './profile/columns';
  
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
  </script>