<script setup lang="ts">
import FlashCard from "@/components/flashy/FlashCard.vue";
import { watchOnce } from "@vueuse/core";
import type { Flashcard } from "~/classes/models";
import server from "~/classes/server";
import type { Carousel, CarouselApi } from "~/components/ui/carousel";

const route = useRoute();
const id = route.params.id;

const flashCards = ref<Flashcard[]>([]);
const difficultCards = ref<boolean[]>([]);

const api = ref<CarouselApi>();
const totalCount = ref(0);
const index = ref(0);

function setApi(val: CarouselApi) {
  api.value = val
}

watchOnce(api, (api) => {
  if (!api) return;

  totalCount.value = api.scrollSnapList().length;
  index.value = api.selectedScrollSnap();

  api.on('select', () => {
    index.value = api.selectedScrollSnap();
  });
});

async function getFlashcardSet(id: string) {
  const set = await server.getFlashcardSet(id);

  if (!set) return;

  flashCards.value = set.flashcards;
}

onMounted(async () => {
  if (typeof id === 'string') {
    await getFlashcardSet(id);
  } else {
    console.error('id is not a string:', id);
  }
});

function updateCardDifficulty() {
  const difficult = difficultCards.value[index.value];

  difficultCards.value[index.value] = !difficult;

  console.log(difficultCards.value);
}

</script>

<template>
  <div id="setPageContainer">
    <div id="carousel-container" class="flex items-center justify-center">
      <Carousel @init-api="setApi" class="relative w-full max-w-2xl">
        <CarouselContent class="content">
          <CarouselItem class="carousel-item" v-for="card in flashCards" :key="card.id">
            <FlashCard v-bind="card"></FlashCard>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <label for="difficulty"
        class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        <Checkbox id="difficulty" @click="updateCardDifficulty" :checked="difficultCards[index]" />
        Vanskelig
      </label>
    </div>
    <Button class="mb-9">Fullfør</Button>
  </div>

  <!-- Exit button -->
</template>

<style scoped>
.content {
  overflow: visible;
}

#setPageContainer {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
#carousel-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;

  gap: 10px;
  flex-direction: column;
}

.carousel-item {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 500px;
  user-select: none;
}

</style>
