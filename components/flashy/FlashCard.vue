<template>
  <div class="card">
    <div class="content" :class="{ flipped: isFlipped }">
      <Card :id="qid" class="card front">
        <div class="difficulty">
          <Checkbox  id="difficulty" @click="markDifficult" v-model="difficult" :checked="difficult as boolean"/>
            <label
              for="difficulty"
              class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Mark as difficult
            </label>
        </div>
        <CardContent class="cardContent" @click="flipCard">
          <CardTitle>{{ question }}</CardTitle>
        </CardContent>
      </Card>
      <Card :id="qid" class="card back">
        <div class="difficulty">
          <Checkbox id="difficulty" @click="markDifficult" v-model="difficult" :checked="difficult as boolean"/>
            <label
              for="difficulty"
              class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
            Mark as difficult
            </label>
        </div>
        <CardContent class="cardContent" @click="flipCard">
          <CardTitle>{{ answer }}</CardTitle>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const isFlipped = ref(false);  //tied to which side of the card is showing
const props = defineProps({
  question: String, //question
  answer: String, //answer
  qid: String, // Question ID
  difficult: Boolean, // Whether the card is marked as difficult
});



const difficult = defineModel();  //model for checkbox binding
const qid = props.qid;  //question id
const emit = defineEmits(["updateDifficult"]);  //emits for checkbox binding

// Set the initial value of the difficult checkbox
onBeforeMount(() => {
  difficult.value = props.difficult;
});

const flipCard = () => {    //flip the card
  isFlipped.value = !isFlipped.value;
};

const markDifficult = () => {    //mark the card as difficult
  console.log("Marked difficult");
  difficult.value = !difficult.value;
  updateDifficult();
  console.log((qid ?? 'question') + difficult.value);
};

const updateDifficult = () => {   //emit the difficult value. gets listened to by the parent which updates their state
  emit('updateDifficult', props.qid, difficult.value);
};

</script>

<style scoped>
.difficulty {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;
  margin: 20px;
}

.cardContent {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.difficultBtn {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;
  background-color: none;
}

.card {
  width: 600px;
  height: 400px;
  perspective: 500px;
  cursor: pointer;
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
