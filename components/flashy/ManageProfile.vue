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

        <form @submit.prevent="onSubmit" class="grid gap-4 py-4">
            <div class="relative flex justify-center align-center pb-5">
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
                <div
                  class="absolute right-[115px] bottom-[25px] z-10 rounded-full overflow-hidden bg-[#dd1d4a] h-[35px]"
                >
                  <Pencil
                    color="white"
                    class="w-[35px] h-[35px] p-[10px] cursor-pointer"
                  ></Pencil>
                </div>
              </Label>
              <!--Needs vmodel and stuff -->
              <Input id="picture" type="file" style="display: none" />
            </div>
            <FormField v-slot="{ componentField }" name="username">
              <FormControl>
                <div class="grid grid-cols-4 items-center gap-4">
                  <Label for="username" class="text-right">Brukernavn</Label>
                  <Input
                    class="col-span-3"
                    type="text"
                    id="username"
                    v-bind="componentField"
                    v-model="username"
                  />
                </div>
              </FormControl>
            </FormField>

            <FormField v-slot="{ componentField }" name="email">
              <FormItem v-auto-animate>
                <FormControl>
                  <div class="grid grid-cols-4 items-center gap-4">
                    <Label for="email" class="text-right">E-post</Label>
                    <Input
                      type="email"
                      id="email"
                      class="col-span-3"
                      v-bind="componentField"
                      v-model="email"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="password">
              <FormItem v-auto-animate>
                <FormControl>
                  <div class="grid grid-cols-4 items-center gap-4">
                    <Label for="password" class="text-right">Passord</Label>
                    <Input
                      type="password"
                      id="password"
                      class="col-span-3"
                      v-bind="componentField"
                      placeholder="Skriv her"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <div class="h-8"></div>
            <DialogFooter>
              <Button id="logout-button" variant="outline" class="absolute left-6">
                <NuxtLink to="/login">Logg ut</NuxtLink>
              </Button>
              <Button type="submit">Lagre</Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import type { UserSettings } from "~/classes/models";
import { Pencil } from "lucide-vue-next";
import { vAutoAnimate } from "@formkit/auto-animate/vue";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { useRouter } from "vue-router";
import * as z from "zod";
import server from "~/classes/server";

const userSettings = ref<UserSettings | null>();

const username = ref("User");
const email = ref("Not found");
const password = ref("********");

onMounted(async () => {
  userSettings.value = await server.getUserSettings();

  if (!userSettings.value) {
    userSettings.value = await server.createUserSettings();
  }

  username.value = userSettings.value?.name || "Bruker";
  email.value = userSettings.value?.email || "Ikke funnet";
});

const router = useRouter();

const formSchema = toTypedSchema(
  z.object({
    username: z.string().min(2, "Username must be at least 2 characters"),
    email: z.string().email("Must be a valid email"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(25, "Password must be less than 25 characters")
      .regex(/.*[0-9].*/, "Password must contain at least one number"),
  })
);

const { handleSubmit } = useForm({
  validationSchema: formSchema,
});

const onSubmit = handleSubmit(async (formData) => {
  console.log(formData);
  await server.updateUserName(formData.username);
  await server.updateUserEmail(formData.email);
  await server.updateUserPassword(formData.password);
  console.log("Submit");
  router.push({ name: "profile" });
});
</script>
