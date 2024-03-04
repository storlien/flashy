<template>
  <div class="card">
    <div class="content" :class="{ flipped: isFlipped }">
      <Card :id="id" class="card front">
        <CardContent class="card-content" @click="flipCard">
          <CardTitle class="text">{{ question }}</CardTitle>
        </CardContent>
      </Card>
      <Card :id="id" class="card back">
        <CardContent class="card-content" @click="flipCard">
          <CardTitle class="text">{{ answer }}</CardTitle>
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
  width: 1200px;
  height: 600px;
  perspective: 2000px;
  width: 1200px;
  height: 600px;
  perspective: 2000px;
  cursor: pointer;
}
.text {
  font-size: 28px;
  font-weight: 600;
  color: #000;
  text-align: center;
}
.text {
  font-size: 28px;
  font-weight: 600;
  color: #000;
  text-align: center;
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

  transform-origin: center;
  transform: scale(0.8);

  transform-origin: center;
  transform: scale(0.8);

  transition: transform 0.5s;
  transform-style: preserve-3d;
}

.card .content.flipped {
  transform: scale(0.8) rotateX(180deg);
  transform: scale(0.8) rotateX(180deg);
}

.front,
.back {
  position: absolute;
  height: 100%;
  width: 100%;
  backface-visibility: hidden;
}

.back {
  transform: rotateX(180deg);
  transform: rotateX(180deg);
}
</style>
