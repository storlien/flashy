<template>
    <div id="edit-set-page">
        <div></div>
        <div id="center-column">
            <div id="header-buttons">
                <Button id="avbrytKnapp" variant="outline" type="submit">
                    <NuxtLink to="/profile">Avbryt</NuxtLink>
                </Button>
                <Button id="create-button" @click="editSet" :disabled="!canSave()">
                    Lagre Endringer
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
                <Checkbox id="public" v-model="isPublic" />
            </label>

            <div class="space" :style="{ height: '10vh' }"></div>

            <div v-for="row, index in rows" class="row" :key="row.id">
                <p>{{ index + 1 }}</p>
                <Input v-model="row.question" maxlength="500" type="Spørsmål" placeholder="Spørsmål" @input="limitText(row, 'question')"  />
                <Input v-model="row.answer" maxlength="500" type="Svar" placeholder="Svar" @input="limitText(row, 'answer')" />
                <Button @click="removeRow(index)" variant="outline">X</Button>
            </div>
            <div class="button-container">
                <Button type="submit" @click="addRow">Legg til spørsmål</Button>
            </div>

            <div class="space" :style="{ height: '10vh' }"></div>
        </div>

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
</style>

<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid';
import { Checkbox } from '@/components/ui/checkbox'
import server from '~/classes/server';
import { useRouter } from 'vue-router';
import type { Flashcard } from '~/classes/models';

const router = useRouter();
const name = ref('');
const category = ref('');
const isPublic = ref(false);

function canSave() {
    if (name.value.length === 0) return false;
    if (category.value.length === 0) return false;
    if (rows.value.length === 0) return false;

    return true;
}

definePageMeta({
    middleware: 'auth',
});

const route = useRoute();
const setId = route.params.id;

const rows = ref<Flashcard[]>([]);

onMounted(() => {
    if (rows.value.length === 0) addRow(); 
});

addRow();

function addRow() {
    rows.value.push({ id: uuidv4(), question: '', answer: '' });
}
function removeRow(index: number) {
    rows.value.splice(index, 1);
}
async function editSet() {
    console.log(name.value, category.value, isPublic.value, rows.value);
    const set = await server.createFlashcardSet(name.value, category.value, isPublic.value, rows.value);

    if (set) {
        console.log("Settet er lagret");
        router.push({ name: 'profile' });

    } else {
        console.log("Ånei, noe gikk galt");
    }
}
function limitText(row: Flashcard, field: 'question' | 'answer') {
    const maxLength = 500; 
    if (row[field].length > maxLength) {
        row[field] = row[field].slice(0, maxLength); 
    }
}

async function getFlashcardSet(id: string) {
  const set = await server.getFlashcardSet(id);

  if (!set) return;
  
  rows.value = set.flashcards;
  name.value = set.name;
  category.value = set.category;
}

onMounted(async () => {
    if (typeof setId !== 'string') return;

    await getFlashcardSet(setId);
});
</script>