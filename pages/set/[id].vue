<script setup lang="ts">
import { AngryIcon, HelpCircleIcon } from "lucide-vue-next";
import type { Flashcard, FlashcardImages, FlashcardSet } from "~/classes/models";
import server from "~/classes/server";
import { Progress as ProgressBar } from "~/components/ui/progress";

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
  cards.value = shuffledFlashcards;
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

  shuffleCards(cards.value, hardCards.value);
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

async function getFlashcardSet() {
  if (typeof id !== "string") return;

  const set = await server.getFlashcardSet(id);

  if (!set) return;

  cards.value = set.flashcards;
  cardSet.value = set;
}

async function getPrefs() {
  const userId = server.auth.getUserId();

  if (!userId) return;
  if (typeof id !== "string") return;

  const prefs = await server.getUserSetPrefs(userId, id);

  if (!prefs) return;

  hardCards.value = new Set(prefs.difficult);
}
const images = ref<FlashcardImage[]>([]);

const images = ref<FlashcardImages[]>([]);

async function getImages() {
  if (!cardSet.value) return;
  images.value = await server.getImagesForFlashcardSet(cardSet.value);

  console.log(images.value);
}

const imageUrls = computed(() => {
  const urls = new Map<string, FlashcardImages>();
  // const urls: FlashcardImages[] = [];

  if (!cards.value || images.value.length === 0) return urls;

  for (const card of cards.value) {
    const pair = images.value.find((image) => image.cardId === card.id);

    if (pair) {
      urls.set(card.id, pair);
    }
  }

  return urls;

  // for (const card of cards.value) {
  //   const pair = images.value.find((image) => image.cardId === card.id);

  //   if (pair) {
  //     urls.push(pair);
  //   }
  // }
  
  // console.log(imageUrls);

  // return urls;
})

// const urls = computed(() => {
//   const urls: { q: string; a: string }[] = [];

//   for (const card of cards.value ?? []) {
//     const question = images.value.find(
//       (image) => image.cardId === card.id && image.type === "question"
//     )?.url;

//     const answer = images.value.find(
//       (image) => image.cardId === card.id && image.type === "answer"
//     )?.url;
    
//     urls.push({
//       q: question ?? '',
//       a: answer ?? '',
//     });
//   }

//   console.log(urls);

//   return urls;
// });

// function getUrl(flashcard: Flashcard, type: "question" | "answer") {
//   const image = images.value.find(
//     (image) => image.cardId === flashcard.id && image.type === type
//   );

//   if (!image) return "";

//   return image.url;
// }

onMounted(async () => {
  await getPrefs();
  await getFlashcardSet();
  await getImages();
  await getComments();
  await checkLiked();

  if (!cards.value) return;

  shuffleCards(cards.value, hardCards.value);
});

async function onChangeLike() {
  isLiked.value = !isLiked.value;
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
  <div v-if="cards && imageUrls" class="set-page">
    <div
      v-if="stack.length"
      class="stack"
      @click="reveal(stack[stack.length - 1].id)"
    >
      <div
        v-for="(card, i) in stack"
        class="pair"
        :key="card.id"
        :style="{
          transform: `translateY(${reverseIterator(i) * 5}%) scale(${
            1 - reverseIterator(i) * 0.05
          })`,
          opacity: 1 - reverseIterator(i) * 0.2,
        }"
      >
        <div class="flashcard" :class="{ answer: revealed === card.id }">
          <img
            v-if="card.hasAnswerImage"
            :src="imageUrls.get(card.id)?.answerURL ?? ''"
            :alt="card.answer"
          />
          <h1>{{ card.answer }}</h1>
        </div>
        <div class="flashcard" :class="{ question: revealed === card.id }">
          <AngryIcon
            v-if="hardCards.has(card.id)"
            class="absolute left-3 top-3 w-8 h-8"
            color="#dd1d4a"
          >
          </AngryIcon>
          <img
            v-if="card.hasQuestionImage"
            :src="imageUrls.get(card.id)?.questionURL ?? ''"
            :alt="card.question"
          />
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
      <Button @click="restart"> Spill igjen </Button>
    </div>
  </div>
  <div v-if="stack.length" class="buttons">
    <button @click="hard">
      <AngryIcon color="#dd1d4a" class="w-10 h-10"></AngryIcon>
    </button>
  </div>

  <div>
  <div class="comments-container">  
    <div class="center-column">
      
      <div class="comments">
        <LikeButton :onChange="onChangeLike" :flashcardSetId="id as string" :isLiked="isLiked"></LikeButton> 
        <h2 class="titleComments">Kommentarer</h2>
        <div v-for="comment in comments">
          <div class="comment">
            <h3>{{ comment.userId }}</h3>
            <p>{{ comment.text }}</p>
          </div>
        </div>
      </div>
      <div class="newComment">
        <Textarea placeholder="Skriv en kommentar her" v-model="comment"></Textarea>
        <Button :disabled="!comment" id="AddCommentButton" @click="createComment">Legg til kommentar</Button>
      </div>
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

.buttons {
  position: relative;
  margin-top: 8vh;

  display: flex;
  gap: 40px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100vw;
}

.set-page {
  position: relative;
  margin: 4vh 0;
  width: 100vw;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
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
  overflow: hidden;

  background-color: white;

  border: 2px solid #f0f0f0;
  box-shadow: 0 5px 10px rgb(0.1, 0.1, 0.1, 0.1);

  position: absolute;

  transition-property: transform;
  transition-duration: 0.4s;
  transition-timing-function: cubic-bezier(0.075, 0.82, 0.165, 1);

  opacity: 1;

  img {
    width: 100%;
    aspect-ratio: 1;
    object-fit: cover;

    border-bottom: 2px solid #f0f0f0;
  }

  h1 {
    // position: absolute;
    // left: 50%;
    // top: 50%;

    margin: auto;

    font-size: 1.5rem;

    text-align: center;

    // transform: translate(-50%, -50%);
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

.comments-container {
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
    padding: 20px;

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
