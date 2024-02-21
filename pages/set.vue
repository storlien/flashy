<script setup lang="ts">
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import FlashCard from "@/components/flashy/FlashCard.vue";

interface FlashCard {
  question: string;
  answer: string;
  qid: string;
  difficult: boolean;
  setId: string;
}

const flashCards = ref<FlashCard[]>([   //flashcards array with dynamic elements
  {
    question: "TestQ",
    answer: "TestA",
    qid: "1",
    difficult: true,
    setId: "1",
  },
  {
    question: "TestQ2",
    answer: "TestA2",
    qid: "2",
    difficult: false,
    setId: "1",
  },
]);

const updateDifficult = (qid: string, difficult: boolean) => {    //update the difficult value. gets called when flashacard emits difficulty change
  const card = flashCards.value.find((card) => card.qid === qid);
  if (card) {
    card.difficult = difficult;
  }
  console.log(card?.difficult);
};
</script>

<template>
  <div id="setPageContainer">
    <div id="carouselContainer" class="flex items-center justify-center">
      <Carousel class="relative w-full max-w-2xl">
        <CarouselContent class="content">
          <CarouselItem
            class="carouselItem"
            v-for="card in flashCards"
            :key="card.qid"
          >
            <FlashCard
              v-bind="card"
              @updateDifficult="updateDifficult"
            ></FlashCard>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
    <Button class="mb-9">Exit set</Button>
  </div>

  <!-- Exit button -->
</template>

<style scoped>
#setPageContainer {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
.carouselItem {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 500px;
  user-select: none;
}

#carouselContainer {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
