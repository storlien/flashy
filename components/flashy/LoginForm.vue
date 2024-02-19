<script setup lang="ts">
import { vAutoAnimate } from "@formkit/auto-animate/vue";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { useRouter } from "vue-router";
import * as z from "zod";
import server from "~/classes/server";

const formSchema = toTypedSchema(
  z.object({
    email: z.string(), //check with database
    password: z.string(), //check with database
  })
);

const { handleSubmit } = useForm({
  validationSchema: formSchema,
});

const router = useRouter();

const onSubmit = handleSubmit(async (formData) => {
  const credentials = await server.auth.login(formData.email, formData.password);

  if (!credentials) return; 
  
  router.push({name: 'profile'});
});
</script>

<template>
  <Card id="login-form">
    <CardHeader>
      <CardTitle>Logg inn</CardTitle>
    </CardHeader>
    <CardContent>
      <form @submit.prevent="onSubmit">
        <FormField v-slot="{ componentField }" name="email">
          <FormItem v-auto-animate>
            <FormControl>
              <Input type="text" placeholder="E-post" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="password">
          <FormItem v-auto-animate>
            <FormControl>
              <Input type="password" placeholder="Passord" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </form>
    </CardContent>
    <CardFooter>
      <Button type="submit" @click="onSubmit">Logg inn</Button>
    </CardFooter>
  </Card>
</template>

<style scoped>
#login-form {
  Input {
    margin-bottom: 10px;
  }

}
</style>
