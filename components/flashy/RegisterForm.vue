<script setup lang="ts">
import { h } from "vue";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import { vAutoAnimate } from "@formkit/auto-animate/vue";

const formSchema = toTypedSchema(
  z.object({
    username: z.string().min(2).max(50), //add check if username is taken
    password: z
      .string()
      .min(6)
      .max(25)
      .regex(/.*[0-9].*/, "Password must contain at least one number"),
    email: z.string().email("Must be a valid email"),
  })
);

const { handleSubmit } = useForm({
  validationSchema: formSchema,
});

const onSubmit = handleSubmit((values) => {
  console.log("Submitted")
});

</script>

<template>
  <h1>Register new user</h1>
  <form @submit.prevent="onSubmit">
    <FormField v-slot="{ componentField }" name="email">
      <FormItem v-auto-animate>
        <FormControl>
          <Input type="email" placeholder="Email" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <FormField v-slot="{ componentField }" name="username">
      <FormItem v-auto-animate>
        <FormControl>
          <Input type="text" placeholder="Username" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <FormField v-slot="{ componentField }" name="password">
      <FormItem v-auto-animate>
        <FormControl>
          <Input
            type="password"
            placeholder="Password"
            v-bind="componentField"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <Button type="submit"> Register </Button>
  </form>
</template>

<style scoped>
  Input {
    margin: 10px;
  }
</style>