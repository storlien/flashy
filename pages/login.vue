<script setup lang="ts">
import RegisterForm from "../components/flashy/RegisterForm.vue";
import LoginForm from "../components/flashy/LoginForm.vue";
</script>

<template>
  <Tabs id="tabs" default-value="login">
    <TabsList id="tabsList">
      <TabsTrigger value="login">Login</TabsTrigger>
      <TabsTrigger value="register">Register</TabsTrigger>
    </TabsList>
    <TabsContent value="register">
      <RegisterForm></RegisterForm>
    </TabsContent>
    <TabsContent value="login"> 
      <LoginForm></LoginForm>
    </TabsContent>
  </Tabs>
</template>

<style lang="scss" scoped>
#tabs {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: auto;
  width: 400px;
}
#tabsList {
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
}
</style>
