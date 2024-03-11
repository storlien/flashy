<script setup lang="ts">
import { AngryIcon, HelpCircleIcon } from 'lucide-vue-next';
import type { Flashcard, FlashcardSet } from '~/classes/models';
import server from '~/classes/server';
import { Progress as ProgressBar } from '~/components/ui/progress';

definePageMeta({
  middleware: 'auth',
});

const route = useRoute();
const id = route.params.id;

const cards = ref<Flashcard[] | undefined>();
const cardSet = ref<FlashcardSet | undefined>();

const hardCards = ref<Set<string>>(new Set());

const index = ref(0);

// Cards visible in stack
const stack = computed(() => {
  if (!cards.value) return [];
  return cards.value.slice(index.value, index.value + 3).toReversed()
});

const revealed = ref('');
const discarded = ref<Flashcard | undefined>();

function shuffleCards(flashcards: Flashcard[], difficultCards: Set<string>) {
  // Split the flashcards into two groups
  const difficult = flashcards.filter(card => difficultCards.has(card.id));
  const regular = flashcards.filter(card => !difficultCards.has(card.id));

  // Shuffle each group
  const shuffledDifficult = difficult.sort(() => Math.random() - 0.5);
  const shuffledRegular = regular.sort(() => Math.random() - 0.5);

  // Merge the groups back into one array
  const shuffledFlashcards = [...shuffledDifficult, ...shuffledRegular];

  // Update flashcards.value
  cards.value = shuffledFlashcards;
}


function reveal(card: string) {
  if (revealed.value === card) {
    discardClass.value = 'success';
    discarded.value = stack.value[reverseIterator(0)];
    console.log(discarded.value);

    revealed.value = '';
    index.value++;
  } else {
    revealed.value = card;
  }
}

function reverseIterator(i: number) {
  return stack.value.length - i - 1;
}

function restart() {
  // TODO: Shuffle the cards
  hardCards.value.clear();
  discarded.value = undefined;
  index.value = 0;
}

const discardClass = ref('success');

function hard() {
  if (!cards.value) return;

  const card = cards.value.splice(index.value, 1)[0];
  discardClass.value = 'fail';
  discarded.value = card;
  cards.value.push(card);
  revealed.value = '';

  hardCards.value.add(card.id);
}

const progress = computed(() => {
  if (!cards.value?.length) return 0;
  return index.value / cards.value.length * 100;
});

async function getFlashcardSet() {
  if (typeof id !== 'string') return;

  const set = await server.getFlashcardSet(id);

  if (!set) return;

  cards.value = set.flashcards;
  cardSet.value = set;
}

async function getPrefs() {
  const userId = server.auth.getUserId();

  if (!userId) return;
  if (typeof id !== 'string') return;

  const prefs = await server.getUserSetPrefs(userId, id);

  if (!prefs) return;

  hardCards.value = new Set(prefs.difficult);
}


onMounted(async () => {
  await getPrefs();
  await getFlashcardSet();

  if (!cards.value) return;

  shuffleCards(cards.value, hardCards.value);
});

</script>

<template>
  <NavBar class="fixed z-10"></NavBar>
  <ProgressBar id="progress" v-model="progress"></ProgressBar>
  <div v-if="cards" class="set-page">
    <div v-if="stack.length" class="stack" @click="reveal(stack[stack.length - 1].id)">
      <div v-for="(card, i) in stack" class="pair" :key="card.id" :style="{
    transform: `translateY(${reverseIterator(i) * 5}%) scale(${1 - reverseIterator(i) * 0.05})`,
    opacity: 1 - reverseIterator(i) * 0.2,
  }">
        <div class="flashcard" :class="{ 'answer': revealed === card.id }">
          <h1>{{ card.answer }}</h1>
        </div>
        <div class="flashcard" :class="{ 'question': revealed === card.id }">
          <AngryIcon v-if="hardCards.has(card.id)" class="absolute left-3 top-3 w-8 h-8" color="#dd1d4a">

          </AngryIcon>
          <h1>{{ card.question }}</h1>
        </div>
      </div>
      <div v-if="discarded" :key="discarded.id">
        <div class="flashcard answer discarded" :class="discardClass">
          <h1>{{ discarded.answer }}</h1>
        </div>
        <div class="flashcard question discarded" :class="discardClass">
          <h1>{{ discarded.question }}</h1>
        </div>
      </div>
    </div>
    <div v-else class="finished">
      <p>Gratulerer, du er ferdig!</p>
      <Button @click="restart">
        Spill igjen
      </Button>
    </div>
  </div>
  <div v-if="stack.length" class="buttons">
    <button class="fail" @click="hard">
      <AngryIcon color="#dd1d4a" class="w-10 h-10"></AngryIcon>
    </button>
  </div>
  <Dialog>
    <DialogTrigger as-child>
      <HelpCircleIcon color="#c0c0c0" class="w-10 h-10 fixed left-5 top-20"></HelpCircleIcon>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Velkommen til Flashy!</DialogTitle>
      </DialogHeader>
      <DialogDescription>
        Her kan du øve deg på flashcards. Klikk på kortene for å se svaret. Klikk igjen for å gå til neste kort.
        <br>
        <br>
        For å markere et kort som vanskelig, trykk på det sure fjeset. Kortet vil da dukke opp igjen på slutten slik at
        du kan prøve deg på nytt.
      </DialogDescription>
      <DialogFooter>
        <Button type="submit">Skjønner!</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<style lang="scss">
#progress {
  width: 30vw;
  position: fixed;

  left: 35vw;
  top: 10vh;
}

.buttons {
  position: absolute;

  bottom: 10vh;

  display: flex;
  gap: 40px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.set-page {
  position: fixed;

  top: 0;

  margin: 0;
  width: 100vw;
  height: 100vh;

  display: grid;
  place-items: center;
}

.stack,
.pair,
.flashcard {
  width: 40vmin;
  aspect-ratio: 5 / 7;

  user-select: none;
  cursor: pointer;
}

.pair {
  position: absolute;

  transition-property: transform;
  transition-duration: 0.2s;
}

.flashcard {
  border-radius: 10px;

  background-color: white;

  border: 2px solid #f0f0f0;
  box-shadow: 0 5px 10px rgb(0.1, 0.1, 0.1, 0.1);

  position: absolute;

  transition-property: transform;
  transition-duration: 0.4s;
  transition-timing-function: cubic-bezier(0.075, 0.82, 0.165, 1);

  opacity: 1;

  h1 {
    position: absolute;
    left: 50%;
    top: 50%;

    font-size: 1.5rem;

    text-align: center;

    transform: translate(-50%, -50%);
  }
}

.flashcard.question {
  transform: translateX(-50%) translateY(0%) rotateZ(-15deg);
}

.flashcard.answer {
  transform: translateX(50%) translateY(0%) rotateZ(15deg);
}

.finished {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.discarded.fail {
  animation: fail 1s ease-out forwards;
}

.discarded.success {
  animation: success 1s ease-out forwards;
}

@keyframes fail {
  to {
    transform: translateX(-500%) rotateZ(-1000deg) scale(0.1);
    background-color: #ffc3b3;
  }
}

@keyframes success {
  to {
    transform: translateX(500%) rotateZ(1000deg) scale(0.1);
  }
}
</style>