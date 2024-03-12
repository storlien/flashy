<template>
  <div class="flex items-center justify-center">
    <!-- add username display-->
    <h3 class="mx-5 text-sm">Bruker</h3>
    <Dialog>
      <DialogTrigger as-child>
        <Avatar class="cursor-pointer h-[45px] w-[45px]">
          <AvatarImage src="" alt="User avatar" />
          <AvatarFallback>
            <span>{{
              userSettings?.name ? userSettings.name.charAt(0) : "Bruker"
            }}</span>
          </AvatarFallback>
        </Avatar>
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
                  <span>{{
              userSettings?.name
                ? userSettings.name.charAt(0)
                : "Bruker"
            }}</span>
                </AvatarFallback>
              </Avatar>
              <div class="absolute right-[115px] bottom-[10px] z-10 rounded-full overflow-hidden bg-[#dd1d4a] h-[35px]">
                <Pencil color="white" class="w-[35px] h-[35px] p-[10px] cursor-pointer"></Pencil>
              </div>
            </Label>
            <!--Needs vmodel and stuff -->
            <Input id="picture" type="file" style="display: none" />
          </div>

          <FormField v-slot="{ componentField }" name="username">
            <FormItem>
              <FormLabel>Brukernavn</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Oppdater brukernavn" v-bind="componentField" v-model="username" />
              </FormControl>
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="email">
            <FormItem>
              <FormLabel>E-post</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Oppdater e-post" v-bind="componentField" v-model="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="password">
            <FormItem>
              <FormLabel>Passord</FormLabel>
              <FormControl>
                <Input type="password" v-bind="componentField" placeholder="Oppdater passord" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <div class="h-4"></div>
          <DialogFooter class="w-full flex flex-row justify-between">
            <Button id="logout-button" variant="outline">
              <NuxtLink to="/login">Logg ut</NuxtLink>
            </Button>
            <Button type="submit">Lagre</Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import type { UserSettings } from "~/classes/models";
import { Pencil } from "lucide-vue-next";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { useRouter } from "vue-router";
import * as z from "zod";
import server from "~/classes/server";

const userSettings = ref<UserSettings | null>();

const username = ref("User");
const email = ref("Not found");
// const password = ref("********");

onMounted(async () => {
  userSettings.value = server.userSettingsCache;

  if (!userSettings.value) {
    userSettings.value = await server.getUserSettings();
  }

  username.value = userSettings.value?.name ?? '';
  email.value = userSettings.value?.email || "Ikke funnet";
});

const router = useRouter();

const formSchema = toTypedSchema(
  z.object({
    username: z.
      string({ required_error: 'Obligatorisk' })
      .min(2, "Må ha minst 2 tegn")
      .max(25, "Kan ikke ha mer enn 25 tegn"),
    email: z
      .string({ required_error: 'Obligatorisk' })
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

const onSubmit = form.handleSubmit(async (formData) => {
  console.log(formData);
  await server.updateUserName(formData.username);

  if (formData.email && formData.email.length > 0) {
    await server.updateUserEmail(formData.email);
  }

  if (formData.password) {
    await server.updateUserPassword(formData.password);
  }

  router.push({ name: "profile" });
});
</script>
