<script setup lang="ts">
import { vAutoAnimate } from "@formkit/auto-animate/vue";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { useRouter } from "vue-router";
import * as z from "zod";
import server from "~/classes/server";

const router = useRouter();

const formSchema = toTypedSchema(
  z.object({
    email: z.string().email("Må være en gyldig e-post"),
    password: z
      .string()
      .min(6, "Passordet må være minst 6 tegn")
      .max(25, "Passordet kan ikke være mer enn 25 tegn")
      .regex(/.*[0-9].*/, "Passordet må inneholde minst ett tall"),
  })
);


const { handleSubmit } = useForm({
  validationSchema: formSchema,
});

const onSubmit = handleSubmit(async (formData) => {
  const credentials = await server.auth.register(formData.email, formData.password);

  if (!credentials) return; 
  
  router.push({name: 'profile'});
});


</script>

<template>
  <form @submit.prevent="onSubmit">
  <Card id="register-form">
    <CardHeader>
      <CardTitle>Registrer</CardTitle>
    </CardHeader>
    <CardContent>
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
      </CardContent>
      <CardFooter>
        <Button type="submit">Registrer</Button>
      </CardFooter>
    </Card>
  </form>
</template>

<style lang="scss" scoped>
#register-form {
  Input {
    margin-bottom: 10px;
  }

}
</style>
