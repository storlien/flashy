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
        <Button id="create-button" @click="createSet" :disabled="!canSave()">
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
            <div v-if="imgURLs[index].questionURL.length == 0" class="m-3 input-container">
              <Input
                :id="'questionFileInput' + index"
                type="file"
                @change="
                  prepareFileUpload($event, row.id, index, true);
                "
                class="hidden"
              />
              <button @click="triggerImageInput(index, true)"><Image color="#dd1d4a" class="w-12 h-12"/></button>
            </div>
            <div
              class="image-container"
              v-if="imgURLs[index].questionURL.length != 0"
            >
              <img :src="imgURLs[index].questionURL" class="flashcard-image" />
              <button @click="removePreview(index, true)">
                <XCircle color="#dd1d4a" class="w-40 h-40 delete-icon"/>
              </button>
            </div>
          </div>
          <CardContent class="card-content">
            <Textarea
              class="flex-1 items-center h-full text resize-none text-center center"
              v-model="row.question"
              :maxlength=maxLength[index].question
              type="Spørsmål"
              placeholder="Spørsmål"
              :class="{'reducedSize': imgURLs[index].questionURL.length != 0, 'fullSize': imgURLs[index].questionURL.length == 0}"
            ></Textarea>
          </CardContent>
        </Card>
        <Card class="card">
          <div>
            <div v-if="imgURLs[index].answerURL.length == 0" class="m-3 input-container">
              <Input
                :id="'answerFileInput' + index"
                type="file"
                @change="
                  prepareFileUpload($event, row.id, index, false);
                "
                class="hidden"
              />
              <button @click="triggerImageInput(index, false)"><Image color="#dd1d4a" class="w-12 h-12"/></button>
            </div>
            <div
              class="image-container"
              v-if="imgURLs[index].answerURL.length != 0"
            >
              <img :src="imgURLs[index].answerURL" class="flashcard-image" />
              <button @click="removePreview(index, false)">
                <XCircle class="delete-icon" color="#dd1d4a" />
              </button>
            </div>
          </div>
          <CardContent class="card-content">
            <Textarea
              class=" text resize-none text-center center"
              v-model="row.answer"
              :maxlength=maxLength[index].answer
              type="Svar"
              placeholder="Svar"
              :class="{'reducedSize': imgURLs[index].answerURL.length != 0, 'fullSize': imgURLs[index].answerURL.length == 0}"
            ></Textarea>
          </CardContent>
        </Card>

        <Button @click="removeRow(index)" variant="outline">X</Button>
      </div>
      <div class="h-10"></div>
      <div class="button-container">
        <Button type="submit" @click="addRow">Legg til spørsmål</Button>
      </div>

      <div class="space" :style="{ height: '10vh' }"></div>
    </div>
  </div>
  <FlashyAlert v-model:open="shouldOpen" title="Ikke støttet filtype" text="Du får bare laste opp filer i følgende formater: jpg, jpeg, png, gif" okBtn="Tilbake"></FlashyAlert>
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
import type { Flashcard, ImageToUpload } from "~/classes/models";
import { XCircle } from "lucide-vue-next";
import { Image } from 'lucide-vue-next';

const router = useRouter();
const name = ref("");
const category = ref("");
const isPublic = ref(false);
const flashcardSetId = server.getNewFlashcardSetId();
const imagesToUpload: ImageToUpload[] = [];
const imgURLs = ref<previewImage[]>([]);
const maxLength = ref<maxLength[]>([]);
const shouldOpen = ref(false);

interface previewImage {
  questionURL: string;
  answerURL: string;
}

interface maxLength {
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

onMounted(() => {
  if (rows.value.length === 0) addRow();
});

addRow();

function addRow() {
  rows.value.push({ id: uuidv4(), question: "", answer: "" });
  imgURLs.value.push({ questionURL: "", answerURL: "" });
  maxLength.value.push({ question: 100, answer: 100 });
}
function removeRow(index: number) {
  rows.value.splice(index, 1);
  imgURLs.value.splice(index, 1);
  maxLength.value.splice(index, 1);
}
async function createSet() {
  console.log(name.value, category.value, isPublic.value, rows.value);
  const set = await server.createFlashcardSet(
    name.value,
    category.value,
    isPublic.value,
    rows.value,
    flashcardSetId
  );

  await uploadImages(); //TODO dette kan ta litt tid, hva med en loading spinner?

  if (set) {
    console.log("Settet er lagret");
    router.push({ name: "profile" });
  } else {
    console.log("Ånei, noe gikk galt");
  }
}

function prepareFileUpload(
  event: Event,
  flashcardId: string,
  index: number,
  isQuestionImage: boolean
) {
  if (isQuestionImage) maxLength.value[index].question = 25;
  else maxLength.value[index].answer = 25;

  const file = (event.target as HTMLInputElement)?.files?.[0];

  if (!file) {
    console.log("No file");
    return;
  }

  const fileExtension = file.name?.split('.').pop()?.toLowerCase();

  const isImage = fileExtension && ['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension);

  if (!isImage) {
    console.log("Not an image");
    shouldOpen.value = true;
    return;
  }

  loadPreview(event, index, isQuestionImage);


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
      flashcardSetId,
      image.flashcardId,
      image.isQuestionImage
    );
  }
}

function loadPreview(event: Event, index: number, isQuestion: boolean) {
  console.log("loadPreview");
  const file = (event.target as HTMLInputElement)?.files?.[0];

  if (!file) {
    console.log("No file");
    return;
  }

  if (isQuestion) {
    imgURLs.value[index].questionURL = URL.createObjectURL(file);
  } else {
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

function triggerImageInput(index : number, isQuestion : boolean) {
  let inputId;
  if (isQuestion) {
    inputId = 'questionFileInput' + index;
  } else {
    inputId = 'answerFileInput' + index;
  }
  const inputElement = document.getElementById(inputId);
  if (inputElement) {
    inputElement.click();
  }
}
</script>
