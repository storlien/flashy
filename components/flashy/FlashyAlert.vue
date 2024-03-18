<template>
    <AlertDialog>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{{props.title}}</AlertDialogTitle>
        <AlertDialogDescription>
          {{ props.text }}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogAction>{{ props.okBtn }}</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>

<script setup lang="ts">
import AlertDialog from '../ui/alert-dialog/AlertDialog.vue';
import AlertDialogTitle from '../ui/alert-dialog/AlertDialogTitle.vue';
import AlertDialogContent from '../ui/alert-dialog/AlertDialogContent.vue';
import AlertDialogAction from '../ui/alert-dialog/AlertDialogAction.vue';
import AlertDialogHeader from '../ui/alert-dialog/AlertDialogHeader.vue';
import AlertDialogDescription from '../ui/alert-dialog/AlertDialogDescription.vue';
import AlertDialogFooter from '../ui/alert-dialog/AlertDialogFooter.vue';

const props = defineProps({
  title: String,
  text: String,
  okBtn: String,
});


</script>

<style scoped>
.a {}
</style>
