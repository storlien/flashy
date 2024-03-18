<template>
  <NavBar></NavBar>
    <div id="profile">
      <div></div>
      <div id="center-column">
  
  
        <div id="profile-left">
        </div>
  
  
  
        <div class="space" :style="{ height: '10vh' }"></div>
  
        <div id="table-container">
          <div id="admin-header">
            <h1>Admins</h1>
          </div>
          <DataTable :columns="columnsAdmin" :data="admins" :emptyText="'Laster...'" :onRowClick="()=> {}"/>
          <div class="h-10">

          </div>
          <form @submit="onSubmit" class="flex flex-row gap-2 w-full">
            <FormField v-slot="{ componentField}" name="userId" class="flex-grow">
              <FormItem class="w-full">
                <FormLabel>Legg til admin</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Bruker ID" v-bind="componentField"/>
                </FormControl>
                <FormMessage/>
              </FormItem>
            </FormField>
            <Button type="submit" class="mt-8">Lagre</Button>
          </form>
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

#admin-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

#table-container {
  display: flex;
  flex-direction: column;

  justify-content: stretch;
  row-gap: 10px;

  #table {
    width: 100%;
  }
}
</style>


<script setup lang="ts">
import ManageProfile from '@/components/flashy/ManageProfile.vue';
import { ref } from 'vue';
import type { UserSettings } from '~/classes/models';
import server from '~/classes/server';
import { columnsAdmin } from '~/classes/columns-admin';
import { z } from 'zod';
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';



const admins = ref<UserSettings[]>([
])

onMounted(async () => {
  admins.value = await server.getAdmins();

})

defineComponent({
  components: {
    ManageProfile,
  },
});


definePageMeta({
  middleware: 'auth',
});

const router = useRouter();


const formSchema = toTypedSchema(
  z.object({
    userId: z
      .string({ required_error: 'Obligatorisk'})
      .min(20, "Må ha minst 20 tegn")
      .max(30, "Kan ha maks 30 tegn"),
      
  })
);

const form = useForm ({
  validationSchema: formSchema,
});

const onSubmit = form.handleSubmit(async (formData) => {
  if (formData.userId) {
    await server.updateRole(formData.userId, "admin")
  }
  router.go(0)
})
</script>