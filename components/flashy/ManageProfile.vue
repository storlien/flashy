<template>
  <Dialog @update:open="(open) => {
    if (open) updateFromCache();
  }">
    <DialogTrigger as-child>
      <div class="flex items-center justify-center">
        <h3 class="mx-3 text-base cursor-pointer">{{
    server.userSettingsCache.value?.name ?? 'Bruker'
  }}</h3>
        <Avatar class="cursor-pointer h-[45px] w-[45px]">
          <AvatarImage src="" alt="User avatar" />
          <AvatarFallback>
            <span>
              {{ server.userSettingsCache.value?.name?.charAt(0) ?? 'B' }}
            </span>
          </AvatarFallback>
        </Avatar>
      </div>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Profil</DialogTitle>
      </DialogHeader>

      <form @submit="onSubmit" class="grid gap-4 py-4">
        <div class="relative flex justify-center">
          <Label for="picture">
            <Avatar class="h-[160px] w-[160px] cursor-pointer">
              <AvatarImage src="" alt="User avatar" class="w-full h-full" />
              <AvatarFallback class="text-xl">
                <span>
                  {{ server.userSettingsCache.value?.name?.charAt(0) ?? 'B' }}
                </span>
              </AvatarFallback>
            </Avatar>
            <div class="absolute right-[115px] bottom-[10px] z-10 rounded-full overflow-hidden bg-[#dd1d4a] h-[35px]">
              <Pencil color="white" class="w-[35px] h-[35px] p-[10px] cursor-pointer"></Pencil>
            </div>
          </Label>
          <Input id="picture" type="file" style="display: none" />
        </div>

        <FormField v-slot="{ componentField }" name="username">
          <FormItem>
            <FormLabel>Brukernavn</FormLabel>
            <FormControl>
              <Input type="text" placeholder="Oppdater brukernavn" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="email">
          <FormItem>
            <FormLabel>E-post</FormLabel>
            <FormControl>
              <Input type="email" placeholder="Oppdater e-post" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="password">
          <FormItem>
            <FormLabel>Passord</FormLabel>
            <FormControl>
              <Input type="password" placeholder="Oppdater passord" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <div class="h-2"></div>

        <DialogFooter class="w-full flex flex-row justify-between">
          <Button id="logout-button" variant="outline" @click="logout">
            Logg ut
          </Button>
          <!-- <div class="w-full"></div> -->
          <Button type="submit">Lagre</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { Pencil } from "lucide-vue-next";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { useRouter } from "vue-router";
import * as z from "zod";
import server from "~/classes/server";

const formSchema = toTypedSchema(
  z.object({
    username: z
      .string({ required_error: 'Obligatorisk' })
      .min(2, "Må ha minst 2 tegn")
      .max(25, "Kan ikke ha mer enn 25 tegn"),
    email: z
      .string({ required_error: 'Obligatorisk' })
      .min(6, "Må ha minst 6 tegn")
      .email("Ugyldig e-postadresse"),
    password: z
      .string()
      .min(6, "Må ha minst 6 tegn")
      .max(25, "Kan ikke ha mer enn 25 tegn")
      .regex(/.*[0-9].*/, "Må inneholde minst ett nummer")
      .optional(),
  })
);

const form = useForm({
  validationSchema: formSchema,
});

const router = useRouter();

const onSubmit = form.handleSubmit(async (formData) => {
  console.log(formData);

  if (formData.username) {
    await server.updateUsername(formData.username);
  }

  if (formData.email) {
    await server.updateUserEmail(formData.email);
  }

  if (formData.password) {
    await server.updateUserPassword(formData.password);
  }

  await router.go(0);
});

watch(server.userSettingsCache, () => {
  updateFromCache();
});

function updateFromCache() {
  form.setFieldValue('username', server.userSettingsCache.value?.name ?? '', true);
  form.setFieldValue('email', server.userSettingsCache.value?.email ?? '', true);
}

async function logout() {
  router.push({ path: '/login' });
  await server.logout();
}
</script>

rXun0VeObBhWqoKXbPaMVwXsXMD3