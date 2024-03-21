<style lang="scss" scoped>
#page {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;

  width: 100vw;
  height: 100vh;
}

#center-column {
  border: 2px solid #f0f0f0;
  padding: 20px 50px;
}

#name-category {
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 10px;

  margin-bottom: 20px;
}

.row {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin: 25px 0;
}

#avbrytKnapp {
  display: flex;
  flex-direction: row;
}

#header-buttons {
  display: flex;
  justify-content: space-between;
}

.button-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.flashcard {
  // width: 30vmin;
  width: 100%;
  aspect-ratio: 5 / 7;

  border-radius: 10px;
  overflow: hidden;
  box-sizing: border-box;

  background-color: white;

  border: 2px solid #f0f0f0;
  box-shadow: 0 5px 10px rgb(0.1, 0.1, 0.1, 0.1);

  padding: 10px;

  display: flex;
  flex-direction: column;
  gap: 10px;

  .image-input {
    width: 100%;
    aspect-ratio: 1;
    flex-shrink: 0;

    border: 2px dashed #f0f0f0;
    border-radius: 5px;

    display: flex;
    align-items: center;
    justify-content: center;

    overflow: hidden;
  }

  .image-container {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  img {
    width: 100%;
    height: 100%;
    aspect-ratio: 1;
    object-fit: cover;
  }

  .text-input {
    flex-grow: 1;
    width: 100%;
    resize: none;
    color: black;
  }
}
</style>

<template>
  <NavBar></NavBar>
  <div id="page">
    <div></div>
    <div id="center-column">
      <div id="header-buttons">
        <Button id="avbrytKnapp" variant="outline" @click="$router.push('/profile')">
          Avbryt
        </Button>
        <Button id="create-button" @click="saveChanges" :disabled="!canSave()">
          Lagre
        </Button>
      </div>

      <div class="space" :style="{ height: '10vh' }"></div>

      <div id="name-category">
        <Input id="name" placeholder="Navn" v-model="name" />
        <Input id="category" placeholder="Kategori" v-model="category" />
      </div>
      <label for="public"
        class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        Offentlig
        <Checkbox id="public" :checked="isPublic" @update:checked="isPublic = !isPublic" />
      </label>

      <div class="space" :style="{ height: '10vh' }"></div>

      <div v-for="(card, index) in flashcards" class="row" :key="card.id">
        <p>{{ index + 1 }}</p>

        <div class="flashcard">
          <label class="image-input">
            <input type="file" accept="image/*" @change="(e: Event) => changeImage(card, e, 'question')" hidden>
            <ImageIcon v-if="!imgUrls[index].questionURL" color="#f0f0f0" class="image-icon w-12 h-12" />
            <div v-else class="image-container">
              <img :src="imgUrls[index].questionURL" />
              <Button variant="ghost" class="absolute left-2 top-2 w-8 h-8 p-0"
                @click.prevent="removeImage(card.id, 'question')">
                <XCircle color="#dd1d4a" class="w-8 h-8"></XCircle>
              </Button>
            </div>
          </label>
          <Textarea class="text-input" v-model="card.question" :maxlength="100" placeholder="Spørsmål"></Textarea>
        </div>
        <div class="flashcard">
          <label class="image-input">
            <input type="file" accept="image/*" @change="(e: Event) => changeImage(card, e, 'answer')" hidden>
            <ImageIcon v-if="!imgUrls[index].answerURL" color="#f0f0f0" class="image-icon w-12 h-12" />
            <div v-else class="image-container">
              <img :src="imgUrls[index].answerURL" />
              <Button variant="ghost" class="absolute left-2 top-2 w-8 h-8 p-0"
                @click.prevent="removeImage(card.id, 'answer')">
                <XCircle color="#dd1d4a" class="w-8 h-8"></XCircle>
              </Button>
            </div>
          </label>
          <Textarea class="text-input" v-model="card.answer" :maxlength="100" placeholder="Svar"></Textarea>
        </div>

        <Button @click="removeRow(card.id)" variant="ghost" class="w-8 h-8 p-0">
          <XCircle color="#dd1d4a" class="w-8 h-8"></XCircle>
        </Button>
      </div>
      <div class="h-10"></div>
      <div class="button-container">
        <Button type="submit" @click="addRow">Legg til spørsmål</Button>
      </div>

      <div class="space" :style="{ height: '10vh' }"></div>
    </div>
  </div>
  <FlashyAlert v-model:open="shouldOpen" title="Ikke støttet filtype"
    text="Du får bare laste opp filer i følgende formater: jpg, jpeg, png, gif" okBtn="Tilbake"></FlashyAlert>
</template>

<script setup lang="ts">
import { Checkbox } from "@/components/ui/checkbox";
import { ImageIcon, XCircle } from "lucide-vue-next";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "vue-router";
import type { Flashcard, FlashcardImages, FlashcardSet } from "~/classes/models";
import server from "~/classes/server";

definePageMeta({
  middleware: "auth",
});

type LocalImagePair = {
  cardId: string;
  questionFile?: File;
  answerFile?: File;
}

const router = useRouter();
const route = useRoute();
const name = ref("");
const category = ref("");
const isPublic = ref(false);
const imgUrls = ref<FlashcardImages[]>([]);
const shouldOpen = ref(false);
const setId = route.params.id;
const cardSet = ref<FlashcardSet | null>(null);

const localImages = new Map<string, LocalImagePair>();

function canSave() {
  if (name.value.length === 0) return false;
  if (category.value.length === 0) return false;
  if (flashcards.value.length === 0) return false;

  return true;
}

function changeImage(card: Flashcard, event: Event, type: 'question' | 'answer') {
  const file = (event.target as HTMLInputElement)?.files?.[0];

  if (!file) return;

  const url = URL.createObjectURL(file);

  console.log(flashcards.value);
  console.log(imgUrls.value);
  const cardIndex = imgUrls.value.findIndex(img => img.cardId === card.id);

  console.log(cardIndex);

  if (cardIndex === -1) return;

  if (type === 'question') {
    imgUrls.value[cardIndex].questionURL = url;
  } else {
    imgUrls.value[cardIndex].answerURL = url;
  }

  if (localImages.has(card.id)) {
    const localImage = localImages.get(card.id);

    if (type === 'question') {
      localImage!.questionFile = file;
    } else {
      localImage!.answerFile = file;
    }

    localImages.set(card.id, localImage!);
  } else {
    localImages.set(card.id, {
      cardId: card.id,
      questionFile: type === 'question' ? file : undefined,
      answerFile: type === 'answer' ? file : undefined,
    });
  }

}

const flashcards = ref<Flashcard[]>([]);

function addRow() {
  const id = uuidv4();

  flashcards.value.push({ id: id, question: "", answer: "" });
  imgUrls.value.push({ cardId: id, questionURL: "", answerURL: "" });

  console.log(flashcards.value);
}

function removeRow(id: string) {
  const row = flashcards.value.find(row => row.id === id);

  if (!row) return;

  const index = flashcards.value.indexOf(row);

  flashcards.value.splice(index, 1);
  imgUrls.value.splice(index, 1);
}

function removeImage(cardId: string, type: "question" | "answer") {
  const imgUrl = imgUrls.value.find(img => img.cardId === cardId);

  if (!imgUrl) return;

  if (type === "question") {
    imgUrl.questionURL = "";
  } else {
    imgUrl.answerURL = "";
  }

  if (localImages.has(cardId)) {
    const localImage = localImages.get(cardId);

    if (type === "question") {
      localImage!.questionFile = undefined;
    } else {
      localImage!.answerFile = undefined;
    }

    if (localImage!.questionFile === undefined && localImage?.answerFile === undefined) {
      localImages.delete(cardId);
    } else {
      localImages.set(cardId, localImage!);
    }
  }
}

async function saveChanges() {
  const set = cardSet.value;

  if (!set) return;

  set.category = category.value;
  set.name = name.value;
  set.isPublic = isPublic.value;
  set.flashcards = flashcards.value;

  for (const card of flashcards.value) {
    const urlPair = imgUrls.value.find(img => img.cardId === card.id);

    if (urlPair) {
      card.hasQuestionImage = urlPair.questionURL.length > 0;
      card.hasAnswerImage = urlPair.answerURL.length > 0;
    }
  }

  if (set) {
    await server.updateFlashcardSet(set);
    await uploadImages(); //TODO dette kan ta litt tid, hva med en loading spinner?

    router.push('/profile');
  }
}

onMounted(async () => {
  if (typeof setId !== "string") return;

  await getFlashcardSet(setId);

  await getImages();
});

async function getImages() {
  if (!cardSet.value) return;
  const images = await server.getImagesForFlashcardSet(cardSet.value);

  imgUrls.value = [];

  for (const image of images) {
    imgUrls.value.push({
      cardId: image.cardId,
      questionURL: image.questionURL ?? "",
      answerURL: image.answerURL ?? "",
    })
  }
}

async function getFlashcardSet(id: string) {
  const set = await server.getFlashcardSet(id);

  if (!set) {
    console.error("Flashcard set not found");
    router.push("/404");
    return;
  }

  console.log(set.id);

  flashcards.value = set!.flashcards;
  name.value = set.name;
  category.value = set.category;
  isPublic.value = set.isPublic;

  cardSet.value = set;
}
async function uploadImages() {
  for (const [cardId, localImage] of localImages) {
    console.log(localImage);
    if (localImage.questionFile) {
      await server.uploadImage(localImage.questionFile, cardSet.value!.id, cardId, true);
    }

    if (localImage.answerFile) {
      await server.uploadImage(localImage.answerFile, cardSet.value!.id, cardId, false);
    }
  }
}
</script>
