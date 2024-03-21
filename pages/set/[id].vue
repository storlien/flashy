<script setup lang="ts">
import { AngryIcon, HelpCircleIcon } from "lucide-vue-next";
import type { Comments, Flashcard, FlashcardImages, FlashcardSet } from "~/classes/models";
import server from "~/classes/server";
import { Progress as ProgressBar } from "~/components/ui/progress";
import { type Comment } from "~/classes/models";
import LikeButton from "~/components/LikeButton.vue";

definePageMeta({
  middleware: "auth",
});

const route = useRoute();
const id = route.params.id;

const cards = ref<Flashcard[] | undefined>();
const cardSet = ref<FlashcardSet | undefined>();

const hardCards = ref<Set<string>>(new Set());

const index = ref(0);
const isLiked = ref(false);

const comment = ref("");
const comments = ref<Comment[]>([]);

async function createComment() {

  const newComment: Comment = {
    userId: server.auth.getUserId()!,
    text: comment.value
  }

  console.log('New comment: ', newComment)

  await server.uploadComment(newComment, id as string);

  comments.value.push({
    userId: await server.getNameOrEmail(newComment.userId),
    text: newComment.text
  })

  comment.value = ""

}

async function getComments() {
  const commentsFromServer: Comments = await server.getComments(id as string);
  for (const c of commentsFromServer.comments) {
    comments.value.push({
      userId: await server.getNameOrEmail(c.userId),
      text: c.text
    });
  }
}

// Cards visible in stack
const stack = computed(() => {
  if (!cards.value) return [];
  return cards.value.slice(index.value, index.value + 3).toReversed();
});

const revealed = ref("");
const discarded = ref<Flashcard | undefined>();

function shuffleCards(flashcards: Flashcard[], difficultCards: Set<string>) {
  // Split the flashcards into two groups
  const difficult = flashcards.filter((card) => difficultCards.has(card.id));
  const regular = flashcards.filter((card) => !difficultCards.has(card.id));

  // Shuffle each group
  const shuffledDifficult = difficult.sort(() => Math.random() - 0.5);
  const shuffledRegular = regular.sort(() => Math.random() - 0.5);

  // Merge the groups back into one array
  const shuffledFlashcards = [...shuffledDifficult, ...shuffledRegular];

  // Update flashcards.value
  return shuffledFlashcards;
}

function reveal(card: string) {
  if (revealed.value === card) {
    discardClass.value = "success";
    discarded.value = stack.value[reverseIterator(0)];
    console.log(discarded.value);

    revealed.value = "";
    index.value++;
  } else {
    revealed.value = card;
  }
}

function reverseIterator(i: number) {
  return stack.value.length - i - 1;
}

function restart() {
  hardCards.value.clear();
  discarded.value = undefined;
  index.value = 0;

  if (!cards.value) return;

  const _cards = shuffleCards(cards.value, hardCards.value);

  cardSet.value!.flashcards = _cards;
  cards.value = _cards;
}

const discardClass = ref("success");

function hard() {
  if (!cards.value) return;

  const card = cards.value.splice(index.value, 1)[0];
  discardClass.value = "fail";
  discarded.value = card;
  cards.value.push(card);
  revealed.value = "";

  hardCards.value.add(card.id);
}

const progress = computed(() => {
  if (!cards.value?.length) return 0;
  return (index.value / cards.value.length) * 100;
});

async function getFlashcardSet(): Promise<FlashcardSet | null> {
  if (typeof id !== "string") return null;

  return await server.getFlashcardSet(id);
}

const images = ref<FlashcardImages[]>([]);

async function getImages(set: FlashcardSet): Promise<FlashcardImages[]> {
  return await server.getImagesForFlashcardSet(set);
}

const imageUrls = computed(() => {
  const urls = new Map<string, FlashcardImages>();

  if (!cards.value || images.value.length === 0) return urls;

  for (const card of cards.value) {
    const pair = images.value.find((image) => image.cardId === card.id);

    if (pair) {
      urls.set(card.id, pair);
    }
  }

  return urls;
})

onMounted(async () => {
  const _set = await getFlashcardSet();

  console.log(_set);

  if (!_set) {
    console.error("Flashcard set not found");
    useRouter().push("/404");
    return;
  }

  const _images = await getImages(_set);

  await getComments();
  await checkLiked();

  const _cards = shuffleCards(_set.flashcards, hardCards.value);

  _set.flashcards = _cards;

  cardSet.value = _set;
  cards.value = _cards;
  images.value = _images;
});

async function onChangeLike() {
  if (cardSet.value === undefined) return;

  isLiked.value = !isLiked.value;

  const userId = server.auth.getUserId();

  if (!userId) return;

  if (cardSet.value?.likes === undefined) cardSet.value.likes = [];

  if (!isLiked.value) {
    const index = cardSet.value.likes.findIndex((id) => id === userId);
    if (index !== -1) cardSet.value.likes.splice(index, 1);
  } else {
    cardSet.value.likes.push(userId);
  }

  await server.changeLike(id as string);
}

async function checkLiked() {
  isLiked.value = await server.isLiked(id as string);
}
</script>

<template>
  <NavBar></NavBar>
  <div v-if="cardSet && images" class="header">
    <Dialog>
      <DialogTrigger as-child>
        <HelpCircleIcon color="#c0c0c0" class="w-8 h-8"></HelpCircleIcon>
      </DialogTrigger>
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Velkommen til Flashy!</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Her kan du øve deg på flashcards. Klikk på kortene for å se svaret.
          Klikk igjen for å gå til neste kort.
          <br />
          <br />
          For å markere et kort som vanskelig, trykk på det sure fjeset. Kortet
          vil dukke opp igjen på slutten slik at du kan prøve deg på nytt.
        </DialogDescription>
        <DialogClose as-child>
          <Button type="submit">Skjønner!</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
    <h1>{{ cardSet.name }}</h1>
    <ProgressBar id="progress" v-model="progress"></ProgressBar>
  </div>
  <div v-else class="header"></div>
  <div v-if="cards && imageUrls" class="set-page">
    <div v-if="stack.length" class="stack" @click="reveal(stack[stack.length - 1].id)">
      <div v-for="(card, i) in stack" class="pair" :key="card.id" :style="{
    transform: `translateY(${reverseIterator(i) * 5}%) scale(${1 - reverseIterator(i) * 0.05
      })`,
  }">
        <div class="flashcard" :class="{ answer: revealed === card.id }">
          <img v-if="card.hasAnswerImage" :src="imageUrls.get(card.id)?.answerURL ?? ''" :alt="card.answer" />
          <h1>{{ card.answer }}</h1>
        </div>
        <div class="flashcard" :class="{ question: revealed === card.id }">
          <AngryIcon v-if="hardCards.has(card.id)" class="absolute left-1 top-1 w-8 h-8" color="#dd1d4a">
          </AngryIcon>
          <img v-if="card.hasQuestionImage" :src="imageUrls.get(card.id)?.questionURL ?? ''" :alt="card.question" />
          <h1>{{ card.question }}</h1>
        </div>
      </div>
      <div v-if="discarded" :key="discarded.id">
        <div class="flashcard answer discarded" :class="discardClass">
          <img v-if="discarded.hasAnswerImage" :src="imageUrls.get(discarded.id)?.answerURL ?? ''" :alt="discarded.answer" />
          <h1>{{ discarded.answer }}</h1>
        </div>
        <div class="flashcard question discarded" :class="discardClass">
          <img v-if="discarded.hasQuestionImage" :src="imageUrls.get(discarded.id)?.questionURL ?? ''" :alt="discarded.question" />
          <h1>{{ discarded.question }}</h1>
        </div>
      </div>
    </div>
    <div v-else class="finished">
      <p>Gratulerer, du er ferdig!</p>
      <Button @click="restart"> Spill igjen </Button>
    </div>
  </div>
  <div v-else class="h-[50-h]"></div>
  <div v-if="stack.length" class="buttons">
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <button @click="hard">
            <AngryIcon color="#dd1d4a" class="w-10 h-10"></AngryIcon>
          </button>
        </TooltipTrigger>
        <TooltipContent>
          Marker som vanskelig
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </div>

  <div class="comments-container">
    <div class="center-column">
      <div class="comments">
        <div class="flex flex-row justify-between w-full mb-4">
          <h1 class="text-lg">Kommentarer</h1>
          <div class="like-row flex flex-row gap-2">
            <span v-if="cardSet && cardSet.likes !== undefined" class="pt-1">
              {{ cardSet.likes?.length }}
            </span>
            <LikeButton :onChange="onChangeLike" :flashcardSetId="(id as string)" :isLiked="isLiked"></LikeButton>
          </div>
        </div>
        <div v-for="comment in comments">
          <div class="comment">
            <h3>{{ comment.userId }}</h3>
            <p>{{ comment.text }}</p>
          </div>
        </div>
      </div>
      <div class="newComment">
        <Textarea placeholder="Skriv en kommentar" v-model="comment"></Textarea>

        <Button :disabled="!comment" id="AddCommentButton" @click="createComment" class="mt-4">
          Legg til kommentar
        </Button>

        <div class="h-10"></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.header {
  width: 100vw;

  top: 10vh;
  padding: 5vh 2vw;

  display: grid;
  align-items: center;
  gap: 20px;
  grid-template-columns: 2rem 2fr 2fr 2fr 2rem;
}

.set-page {
  position: relative;
  width: 100vw;

  padding: 5vh 0;
}

.buttons {
  position: relative;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100vw;

  padding-top: 2vh;
  padding-bottom: 5vh;
  border-bottom: 2px solid #f0f0f0;
}

.stack {
  margin: auto;
}

.stack,
.pair,
.flashcard {
  width: 20vw;
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
  overflow: hidden;

  background-color: white;

  border: 2px solid #f0f0f0;
  box-shadow: 0 5px 10px rgb(0.1, 0.1, 0.1, 0.1);

  position: absolute;

  transition-property: transform;
  transition-duration: 0.4s;
  transition-timing-function: cubic-bezier(0.075, 0.82, 0.165, 1);

  opacity: 1;

  padding: 20px;

  img {
    width: 100%;
    aspect-ratio: 1;
    // object-fit: cover;
    object-fit: contain;

    border-bottom: 2px solid #f0f0f0;

    border-radius: 5px;
    margin-bottom: 10px;
  }

  h1 {
    margin: auto;
    font-size: 1rem;
    text-align: center;
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

  height: 72vh;

  border-bottom: 2px solid #f0f0f0;
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

.comments-container {
  margin-top: 5vh;
  width: 100vw;
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
}

.center-column {
  grid-column: 2;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.newComment {
  grid-column: 2;
  flex-direction: left;
  width: 100%;
  margin-top: 20px;
}

.comments {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: start;

  .comment {
    width: 100%;
    border: 2px solid #f0f0f0;
    // margin: 0 20px;
    padding: 5px 20px;

    h3 {
      font-size: 12px;
      font-weight: bold;
    }

    p {
      font-size: 12px;
    }


    border-radius: 10px;
  }
}
</style>
