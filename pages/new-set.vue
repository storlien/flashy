<template>
    <div>
        <Button id="avbrytKnapp" type="submit"><NuxtLink to="./profile">Avbryt</NuxtLink></Button>
        <div class="items-top flex gap-x-2">
        <Checkbox id="terms1" v-model="isPublic"/>
        <div class="grid gap-1.5 leading-none">
        <label
        for="terms1"
        class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
        Offentlig sett
        </label>
        <!-- <p class="text-sm text-muted-foreground">
       Huk av for privat.
        </p> -->
        </div>
    </div>
        
        <!--Bind this input to name ref -->
        <Input id="Navn" placeholder="Navn" v-model="name"/>
        <Input id="Category" placeholder="Kategori" v-model="category"/>
        <div v-for="row, index in rows" class="row" :key="row.id">
            <p>{{ index + 1 }}</p>
            <Input v-model="row.question" type="Spørsmål" placeholder="Spørsmål"/>
            <Input v-model="row.answer" type="Svar" placeholder="Svar" />
            <Button @click="removeRow(index)">X</Button>
        </div>
        <div class="button-container">
            <Button type="submit" @click="addRow">Legg til i settet</Button> 
            <Button id="lagreKnapp" type="LagreSet" @click="createSet">Opprett sett</Button>
        </div>
        

        <!-- Combobox til kategorier -->
    </div>
</template>

<style lang="scss">
.row {
    display: flex;  
    flex-direction: row;
    gap: 20px;
    margin: 20px 0;
    padding: 0 20px;
}
#avbrytKnapp {
    padding-top: 20px;
    padding-bottom: 20px;
    display: flex;
    flex-direction: row;
    gap: 20px;
    margin: 20px 0;
    padding: 0 20px;
}
#Navn {
    display: flex;
    padding-bottom: 20px;
    margin: 20px 0;
}
.button-container {
    display: flex;
    flex-direction: row;
    gap: 20px;
    margin: 20px 0;
    padding: 0 20px;
}

</style>

<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid';
import { Checkbox } from '@/components/ui/checkbox'
import server from '~/classes/server';
import { useRouter } from 'vue-router';

const router = useRouter();

const name = ref('');
const category = ref('');
const isPublic = ref(false);

definePageMeta({
  middleware: 'auth',
});

const rows = ref<Flashcard[]>([]);

function addRow() {
    rows.value.push({ id: uuidv4(), question: '', answer: '' });
}
function removeRow(index: number) {
    rows.value.splice(index, 1);
}
async function createSet() {
    console.log(name.value, category.value, isPublic.value, rows.value);
    const set = await server.createFlashcardSet(name.value, category.value, isPublic.value, rows.value);

    if (set) {
        console.log("Settet er lagret");
        router.push({name: 'profile'});
        
    } else {
        console.log("Ånei, noe gikk galt");
    }
}
</script>