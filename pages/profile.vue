<template>
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
        <Button type="submit">
          <NuxtLink to="/new-set">Nytt sett</NuxtLink>
        </Button>
        <DataTable id="table" :columns="columns" :data="data" :on-row-click="onRowClick" on />  
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
  column-gap: 5px;
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

#table-container {
  display: flex;
  flex-direction: column;

  align-items: flex-end;
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
import ManageProfile from '@/components/flashy/ManageProfile.vue';

defineComponent({
  components: {
    ManageProfile,
  },
});


definePageMeta({
  middleware: 'auth',
});

const data = ref<FlashcardSet[]>([]);

const router = useRouter();

// console.log(router.getRoutes())

function onRowClick(index: string) {
  // alert(index);
  const row = data.value[parseInt(index)];
  const rowId = row.id;

  console.log(row.id);

  router.push({ path: `/set/${rowId}`});
  // console.log(row);
}

async function getData(): Promise<FlashcardSet[]> {
  return server.getUserFlashcardSets();
}

onMounted(async () => {
  data.value = await getData();
});
</script>