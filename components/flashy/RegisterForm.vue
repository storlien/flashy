<script setup lang="ts">
import { vAutoAnimate } from "@formkit/auto-animate/vue";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import * as z from "zod";

const router = useRouter();

const formSchema = toTypedSchema(
  z.object({
    email: z.string().email("Must be a valid email"),
    password: z
      .string()
      .min(6)
      .max(25)
      .regex(/.*[0-9].*/, "Password must contain at least one number"),
  })
);

import { useRouter } from "vue-router";
import { Authenticator } from "~/classes/authenticator";
import { Backend } from "~/classes/backend";

const { handleSubmit } = useForm({
  validationSchema: formSchema,
});

const onSubmit = handleSubmit(async (formData) => {
  const credentials = await Backend.auth.register(formData.email, formData.password);

  if (!credentials) return; 
  
  router.push({name: 'profile'});
});


</script>

<template>
  <Card id="register-form">
    <CardHeader>
      <CardTitle>Registrer</CardTitle>
    </CardHeader>
    <CardContent>
      <form @submit.prevent="onSubmit">
        <!-- <FormField v-slot="{ componentField }" name="email">
          <FormItem v-auto-animate>
            <FormControl>
              <Input type="email" placeholder="Email" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField> -->
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
      <Button type="submit" @click="onSubmit">Registrer</Button>
    </CardFooter>
  </Card>
</template>

<style lang="scss" scoped>
#register-form {
  Input {
    margin-bottom: 10px;
  }

}
</style>
