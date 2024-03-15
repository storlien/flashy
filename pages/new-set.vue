<template>
  <div id="new-set-page">
    <div></div>
    <div id="center-column">
      <div id="header-buttons">
        <Button id="avbrytKnapp" variant="outline" @click="$router.push('/profile')">
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
            <Label for="picture">Picture</Label> <!--Needs vmodel and stuff-->
            <Input id="picture" type="file" @change="prepareFileUpload($event, row.id, index, true)" />
          </div>
          <CardContent class="card-content">
            <Textarea
              class="flex-1 items-center h-full text resize-none text-center center"
              v-model="row.question"
              maxlength="200"
              type="Spørsmål"
              placeholder="Spørsmål"
              @input="limitText(row, 'question')"
            ></Textarea>
          </CardContent>
        </Card>
        <Card class="card">
          <div>
            <Label for="picture">Picture</Label> <!--Needs vmodel and stuff-->
            <Input id="picture" type="file" @change="prepareFileUpload($event, row.id, index, false)" />
          </div>
          <CardContent class="card-content">
            <Textarea
              class="flex-1 items-center h-full text resize-none text-center center"
              v-model="row.answer"
              maxlength="200"
              type="Svar"
              placeholder="Svar"
              @input="limitText(row, 'answer')"
            ></Textarea>
          </CardContent>
        </Card>

        <Button @click="removeRow(index)" variant="outline">X</Button>
      </div>
      <div class="button-container">
        <Button type="submit" @click="addRow">Legg til spørsmål</Button>
      </div>

      <div class="space" :style="{ height: '10vh' }"></div>
    </div>

    <!-- Combobox til kategorier -->
  </div>
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
  gap: 10px;
  margin: 20px 0;
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
  width: 600px;
  height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.text {
  font-size: 28px;
  font-weight: 600;
  padding-top: 80px;
  margin-top: 25px;
  line-height: 1.5;
  height: 100%;
}

.card-content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

#picture {
  width: 100%;
}
</style>

<script setup lang="ts">
import { v4 as uuidv4 } from "uuid";
import { Checkbox } from "@/components/ui/checkbox";
import server from "~/classes/server";
import { useRouter } from "vue-router";
import type { Flashcard, ImageToUpload } from "~/classes/models";

const router = useRouter();
const name = ref("");
const category = ref("");
const isPublic = ref(false);
const flashcardSetId = server.getNewFlashcardSetId();
const imagesToUpload: ImageToUpload[] = []; 

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
}
function removeRow(index: number) {
  rows.value.splice(index, 1);
}
async function createSet() {
  console.log(name.value, category.value, isPublic.value, rows.value);
  const set = await server.createFlashcardSet(
    name.value,
    category.value,
    isPublic.value,
    rows.value,
    flashcardSetId,
  );

  await uploadImages(); //TODO dette kan ta litt tid, hva med en loading spinner?

  if (set) {
    console.log("Settet er lagret");
    router.push({ name: "profile" });
  } else {
    console.log("Ånei, noe gikk galt");
  }
}
function limitText(row: Flashcard, field: "question" | "answer") {
  const maxLength = 500;
  if (row[field].length > maxLength) {
    row[field] = row[field].slice(0, maxLength);
  }
}

function prepareFileUpload(event: Event, flashcardId: string, index: number, isQuestionImage: boolean) {
  const file = (event.target as HTMLInputElement)?.files?.[0];

  if (!file) {
    console.log("No file")
    return;
  }

  if (isQuestionImage) {
    rows.value[index].hasQuestionImage = true;
  } else {
    rows.value[index].hasAnswerImage = true;
  }

  let alreadyExists = false;

  for (const flashcard of imagesToUpload) {
    if (flashcard.flashcardId === flashcardId && flashcard.isQuestionImage === isQuestionImage) {
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
    const response = await server.uploadImage(image.file, flashcardSetId, image.flashcardId, image.isQuestionImage);
  }
}

</script>