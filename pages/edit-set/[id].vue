<template>
  <div id="new-set-page">
    <div></div>
    <div id="center-column">
      <div id="header-buttons">
        <Button
          id="avbrytKnapp"
          variant="outline"
          @click="$router.push('/profile')"
        >
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
      <label
        for="public"
        class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Offentlig
        <Checkbox id="public" v-model="isPublic" />
      </label>

      <div class="space" :style="{ height: '10vh' }"></div>

      <div v-for="(row, index) in rows" class="row" :key="row.id">
        <p>{{ index + 1 }}</p>
        <Card class="card">
          <div>
            <div
              v-if="imgURLs.find(urls => urls.cardId == row.id)?.questionURL.length == 0 || imgURLs.find(urls => urls.cardId == row.id)?.questionURL == null"
              class="m-3 input-container"
            >
              <Input
                :id="'questionFileInput' + index"
                type="file"
                @change="prepareFileUpload($event, row.id, index, true)"
                class="hidden"
              />
              <button @click="triggerImageInput(index, true)">
                <Image color="#dd1d4a" class="w-12 h-12" />
              </button>
            </div>
            <div
              class="image-container"
              v-if="imgURLs[index].questionURL.length != 0"
            >
              <img :src="imgURLs.find(urls => urls.cardId === row.id)?.questionURL ?? ''" class="flashcard-image" />
              <button @click="removePreview(index, true)">
                <XCircle color="#dd1d4a" class="w-40 h-40 delete-icon" />
              </button>
            </div>
          </div>
          <CardContent class="card-content">
            <Textarea
              class="flex-1 items-center h-full text resize-none text-center center"
              v-model="row.question"
              maxlength="200"
              type="Spørsmål"
              placeholder="Spørsmål"
              @input="limitText(row, 'question')"
              :class="{
                reducedSize: imgURLs[index].questionURL.length != 0,
                fullSize: imgURLs[index].questionURL.length == 0,
              }"
            ></Textarea>
          </CardContent>
        </Card>
        <Card class="card">
          <div>
            <div
              v-if="imgURLs.find(urls => urls.cardId == row.id)?.answerURL.length == 0 || imgURLs.find(urls => urls.cardId == row.id)?.answerURL == null"
              class="m-3 input-container"
            >
              <Input
                :id="'answerFileInput' + index"
                type="file"
                @change="prepareFileUpload($event, row.id, index, false)"
                class="hidden"
              />
              <button @click="triggerImageInput(index, false)">
                <Image color="#dd1d4a" class="w-12 h-12" />
              </button>
            </div>
            <div
              class="image-container"
              v-if="imgURLs[index].answerURL.length != 0"
            >
              <img :src="imgURLs.find(urls => urls.cardId === row.id)?.answerURL ?? ''" class="flashcard-image" />
              <button @click="removePreview(index, false)">
                <XCircle class="delete-icon" color="#dd1d4a" />
              </button>
            </div>
          </div>
          <CardContent class="card-content">
            <Textarea
              class="text resize-none text-center center"
              v-model="row.answer"
              maxlength="{{maxLength[index].answer}}"
              type="Svar"
              placeholder="Svar"
              @input="limitText(row, 'answer')"
              :class="{
                reducedSize: imgURLs[index].answerURL.length != 0,
                fullSize: imgURLs[index].answerURL.length == 0,
              }"
            ></Textarea>
          </CardContent>
        </Card>

        <Button @click="removeRow(row.id)" variant="outline">X</Button>
      </div>
      <div class="button-container">
        <Button type="submit" @click="addRow">Legg til spørsmål</Button>
      </div>

      <div class="space" :style="{ height: '10vh' }"></div>
    </div>
  </div>
  <FlashyAlert
    v-model:open="shouldOpen"
    title="Ikke støttet filtype"
    text="Du får bare laste opp filer i følgende formater: jpg, jpeg, png, gif"
    okBtn="Tilbake"
  ></FlashyAlert>
</template>

<style lang="scss">
#new-set-page {
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
  gap: 10px;
  margin: 20px 0;
}

.image-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.input-container {
  width: 250px;
  margin-top: 18px;
  display: flex;
  justify-content: center;
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

.card {
  width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  aspect-ratio: 5/7;
}

.text {
  font-size: 28px;
  font-weight: 600;
  padding-top: 80px;
  line-height: 1.5;
  height: 100%;
}

.card-content {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 0;
}

#picture {
  width: 100%;
}

.reducedSize {
  height: 110%;
  padding-top: 0;
  margin-top: 10px;
}

.fullSize {
  height: 100%;
  padding-top: 125px;
  padding-bottom: 80px;
  margin-top: 20px;
}

.delete-icon {
  position: absolute;
  top: 5px;
  right: -15px;
  background-color: white;
  border: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
  width: 40px;
  height: 40px;
}

.flashcard-image {
  width: 250px;
  height: 250px;
  object-fit: cover;
  border-radius: 10px;
  margin-top: 20px;
  margin-bottom: 10px;
}
</style>

<script setup lang="ts">
import { v4 as uuidv4 } from "uuid";
import { Checkbox } from "@/components/ui/checkbox";
import server from "~/classes/server";
import { useRouter } from "vue-router";
import type { Flashcard, FlashcardImages, FlashcardSet, ImageToUpload } from "~/classes/models";
import { XCircle } from "lucide-vue-next";
import { Image } from "lucide-vue-next";

const router = useRouter();
const route = useRoute();
const name = ref("");
const category = ref("");
const isPublic = ref(false);
const flashcardSetId = route.params.id;
const imagesToUpload: ImageToUpload[] = [];
const imgURLs = ref<FlashcardImages[]>([]);
const maxLength = ref<maxLength[]>([]);
const shouldOpen = ref(false);
const setId = route.params.id;
const cardSet = ref<FlashcardSet | null>(null);

interface maxLength {
  id: string;
  question: number;
  answer: number;
}

function canSave() {
  if (name.value.length === 0) return false;
  if (category.value.length === 0) return false;
  if (rows.value.length === 0) return false;

  return true;
}

definePageMeta({
  middleware: "auth",
});

const rows = ref<Flashcard[]>([]);

addRow();

function addRow() {
  const id = uuidv4();
  console.log(id);
  rows.value.push({ id: id, question: "", answer: "" });
  imgURLs.value.push({ cardId: id, questionURL: "", answerURL: "" });
  maxLength.value.push({ id: id, question: 200, answer: 200 });
  console.log(rows.value);
}

function removeRow(id: string) {
  const row = rows.value.find(row => row.id === id);
  if (!row) return;
  rows.value.splice(rows.value.indexOf(row), 1);
  imgURLs.value.splice(rows.value.indexOf(row), 1);
  maxLength.value.splice(rows.value.indexOf(row), 1);
}

let set: FlashcardSet | null = null;

async function saveChanges() {
  if (!set) return;

  set.category = category.value;
  set.name = name.value;
  set.isPublic = isPublic.value;
  set.flashcards = rows.value;

  await server.updateFlashcardSet(set);

  await uploadImages(); //TODO dette kan ta litt tid, hva med en loading spinner?

  if (set) {
    console.log("Settet er lagret");
    router.push({ name: "profile" });
  } else {
    console.log("Ånei, noe gikk galt");
  }
}

onMounted(async () => {
  if (typeof setId !== "string") return;

  await getFlashcardSet(setId);

  for (let index = 0; index < rows.value.length; index++) {
    imgURLs.value.push({cardId:"", questionURL: "", answerURL: "" });
  }

  await getImages();
});

async function getImages() {
  if (!cardSet.value) return;
  const images = await server.getImagesForFlashcardSet(cardSet.value);

  for (const image of images) {
    imgURLs.value.push({
      cardId: image.cardId,
      questionURL: image.questionURL?? "",
      answerURL: image.answerURL?? "",})
  }

  console.log(images);
  console.log(imgURLs.value);
  // for (let index = 0; index < images.length; index += 2) {
  //   imgURLs[index] = {
  //     questionURL: images[index]?.url ?? '',
  //     answerURL: images[index + 1]?.url ?? '',
  //   };
  // }
}

async function getFlashcardSet(id: string) {
  set = await server.getFlashcardSet(id);

  if (!set) return;

  console.log(set.id);

  rows.value = set!.flashcards;
  name.value = set.name;
  category.value = set.category;

  cardSet.value = set;
}

function limitText(row: Flashcard, field: "question" | "answer") {
  const maxLength = 500;
  if (row[field].length > maxLength) {
    row[field] = row[field].slice(0, maxLength);
  }
}

function prepareFileUpload(
  event: Event,
  flashcardId: string,
  index: number,
  isQuestionImage: boolean
) {
  const file = (event.target as HTMLInputElement)?.files?.[0];

  if (!file) {
    console.log("No file");
    return;
  }

  const fileExtension = file.name?.split(".").pop()?.toLowerCase();

  const isImage =
    fileExtension && ["jpg", "jpeg", "png", "gif"].includes(fileExtension);

  if (!isImage) {
    console.log("Not an image");
    shouldOpen.value = true;
    return;
  }

  loadPreview(event, flashcardId, isQuestionImage);

  if (isQuestionImage) {
    rows.value[index].hasQuestionImage = true;
  } else {
    rows.value[index].hasAnswerImage = true;
  }

  let alreadyExists = false;

  for (const flashcard of imagesToUpload) {
    if (
      flashcard.flashcardId === flashcardId &&
      flashcard.isQuestionImage === isQuestionImage
    ) {
      flashcard.file = file;
      alreadyExists = true;
    }
  }

  if (!alreadyExists) {
    imagesToUpload.push({
      flashcardId,
      file,
      isQuestionImage,
    });
  }
}

async function uploadImages() {
  for (const image of imagesToUpload) {
    const response = await server.uploadImage(
      image.file,
      flashcardSetId[0],
      image.flashcardId,
      image.isQuestionImage
    );
  }
}

function loadPreview(event: Event, id: string, isQuestion: boolean) {
  console.log("loadPreview");
  const file = (event.target as HTMLInputElement)?.files?.[0];

  if (!file) {
    console.log("No file");
    return;
  }

  if (isQuestion) {
    const card = imgURLs.value.find(urls => urls.cardId === id);
    if (card) {
      card.questionURL = URL.createObjectURL(file);
    }
    
  } else {
    const card = imgURLs.value.find(urls => urls.cardId === id);
    if (card) {
      card.questionURL = URL.createObjectURL(file);
    }
    imgURLs.value[index].answerURL = URL.createObjectURL(file);
  }

  console.log(file);
}

function removePreview(index: number, isQuestion: boolean) {
  if (isQuestion) {
    imgURLs.value[index].questionURL = "";
  } else {
    imgURLs.value[index].answerURL = "";
  }
}

function triggerImageInput(index: number, isQuestion: boolean) {
  let inputId;
  if (isQuestion) {
    inputId = "questionFileInput" + index;
  } else {
    inputId = "answerFileInput" + index;
  }
  const inputElement = document.getElementById(inputId);
  if (inputElement) {
    inputElement.click();
  }
}
</script>
