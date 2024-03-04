<template>
  <div class="card">
    <div class="content">
      <Card :id="id" class="card front">
        <CardContent class="card-content">
          <!-- add photo -->
          <!-- <CardTitle class="text"><TextArea :v-model=props.vModel></TextArea></CardTitle> -->
          <Textarea
            :v-model="props.vModel"
            class="flex-1 items-center h-full text resize-none text-center center"
            placeholder="Klikk her for å begynne å skrive"
            maxlength="200"
          ></Textarea>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">

const props = defineProps({
  id: String,
  question: String,
  vModel: String,
});

const id = props.id; //question id
</script>

<style scoped>
.card {
  width: 600px;
  height: 300px;
}
.text {
  font-size: 28px;
  font-weight: 600;
  /*
  display: flex;
  align-items: center;
  justify-content: center;
  */
  padding-top: 100px;
  margin-top: 25px; /* temporary, should be removed when photos are implemented */
  line-height: 1.5;
}
.card-content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.content {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
