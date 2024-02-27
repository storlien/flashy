<script setup lang="ts">
import FlashCard from "@/components/flashy/FlashCard.vue";
import { watchOnce } from "@vueuse/core";
import type { Flashcard, FlashcardSet, FlashcardSetPrefs } from "~/classes/models";
import server from "~/classes/server";
import type { Carousel, CarouselApi } from "~/components/ui/carousel";

definePageMeta({
  middleware: 'auth',
});

const route = useRoute();
const id = route.params.id;

const flashcardSet = ref<FlashcardSet | undefined>();
const flashCards = ref<Flashcard[]>([]);
const difficultCards = ref<Set<string>>(new Set());

const api = ref<CarouselApi>();
const totalCount = ref(0);
const index = ref(0);

const router = useRouter();

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

  const flashcards = set.flashcards;


  flashCards.value = set.flashcards;
  flashcardSet.value = set;
}

async function getPrefs() {
  const userId = server.auth.getUserId();

  if (!userId) return;
  if (typeof id !== 'string') return;

  const prefs = await server.getUserSetPrefs(userId, id);

  if (!prefs) return;

  difficultCards.value = new Set(prefs.difficult);
}

function shuffleCards(cards: Flashcard[], difficultCards: Set<string>) {
  // Split the flashcards into two groups
  const difficult = cards.filter(card => difficultCards.has(card.id));
  const regular = cards.filter(card => !difficultCards.has(card.id));

  // Shuffle each group
  const shuffledDifficult = difficult.sort(() => Math.random() - 0.5);
  const shuffledRegular = regular.sort(() => Math.random() - 0.5);

  // Merge the groups back into one array
  const shuffledFlashcards = [...shuffledDifficult, ...shuffledRegular];

  // Update flashcards.value
  flashCards.value = shuffledFlashcards;
}

onMounted(async () => {
  if (typeof id === 'string') {
    await getPrefs();
    await getFlashcardSet(id);

    shuffleCards(flashCards.value, difficultCards.value);
  } 
});

function updateCardDifficulty() {
  const questionId = flashCards.value[index.value].id;
  const difficult = difficultCards.value.has(questionId);

  if (difficult) {
    difficultCards.value.delete(questionId);
  } else {
    difficultCards.value.add(questionId);
  }
}

const isDifficultSlide = computed(() => {
  if (flashCards.value.length == 0) return false;

  const questionId = flashCards.value[index.value].id;
  return difficultCards.value.has(questionId);
});

async function finish() {
  const userId = server.auth.getUserId();

  if (!userId) return;
  if (!flashcardSet.value) return;
  if (typeof id !== 'string') return;

  const prefs: FlashcardSetPrefs = {
    userId: userId,
    setId: id,
    difficult: Array.from(difficultCards.value),
    completed: [],
  };

  await server.updateUserSetPrefs(prefs);

  router.push({ name: 'profile' });
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
        <Checkbox id="difficulty" @click="updateCardDifficulty" :checked="isDifficultSlide" />
        Vanskelig
      </label>
    </div>
    <Button class="mb-9" @click="finish">Fullfør</Button>
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
  width: 2000px;
  height: 600px;
  user-select: none;
}
</style>
