<template>
  <div class="card">
    <div class="content" :class="{ flipped: isFlipped }">
      <Card :id="id" class="card front">
        <CardContent class="card-content" @click="flipCard">
          <CardTitle>{{ question }}</CardTitle>
        </CardContent>
      </Card>
      <Card :id="id" class="card back">
        <CardContent class="card-content" @click="flipCard">
          <CardTitle>{{ answer }}</CardTitle>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
const isFlipped = ref(false);

const props = defineProps({
  id: String,
  question: String,
  answer: String,
});

const id = props.id;  //question id

/** Flip the card. */
const flipCard = () => {
  isFlipped.value = !isFlipped.value;
};
</script>

<style scoped>
.card {
  width: 600px;
  height: 400px;
  perspective: 500px;
  cursor: pointer;
}

.card-content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}


.content {
  position: absolute;
  width: 100%;
  height: 100%;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);

  transition: transform 0.5s;
  transform-style: preserve-3d;
}

.card .content.flipped {
  transform: rotateY(180deg);
}

.front,
.back {
  position: absolute;
  height: 100%;
  width: 100%;
  backface-visibility: hidden;
}

.back {
  transform: rotateY(180deg);
}
</style>
