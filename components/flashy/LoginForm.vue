<script setup lang="ts">
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import { vAutoAnimate } from "@formkit/auto-animate/vue";

const formSchema = toTypedSchema(
  z.object({
    username: z.string(), //check with database
    password: z.string(), //check with database
  })
);

const { handleSubmit } = useForm({
  validationSchema: formSchema,
});

const onSubmit = handleSubmit((values) => {
  console.log("Submitted");
});
</script>

<template>
  <Card id="login-form">
    <CardHeader>
      <CardTitle>Login</CardTitle>
    </CardHeader>
    <CardContent>
      <form @submit.prevent="onSubmit">
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
      </form>
    </CardContent>
    <CardFooter>
      <Button type="submit" @click="onSubmit">Login</Button>
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
