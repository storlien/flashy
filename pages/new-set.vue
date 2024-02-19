<template>
    <div>
        <Button id="avbrytKnapp" type="submit"><NuxtLink to="./profile">Avbryt</NuxtLink></Button>
        <div class="items-top flex gap-x-2">
        <Checkbox id="terms1" />
        <div class="grid gap-1.5 leading-none">
        <label
        for="terms1"
        class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
        Privat eller offentlig sett?
        </label>
        <p class="text-sm text-muted-foreground">
       Huk av for privat.
        </p>
        </div>
    </div>
        
        <Input id="Navn" placeholder="Navn"/>
        <div v-for="row, index in rows" class="row" :key="row.id">
            <p>{{ index + 1 }}</p>
            <Input type="Spørsmål" placeholder="Spørsmål"/>
            <Input type="Svar" placeholder="Svar" />
            <Button @click="removeRow(index)">X</Button>
        </div>
        <div class="button-container">
            <Button type="submit" @click="addRow">Legg til i settet</Button> 
            <Button id="lagreKnapp" type="LagreSet" @click="SaveSet">Lagre set</Button>
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

definePageMeta({
  middleware: 'auth',
});

type QuestionAnswer = {
    id: string;
    question: string;
    answer: string;
}

const rows = reactive<QuestionAnswer[]>([]);

function addRow() {
    rows.push({ id: uuidv4(), question: '', answer: '' });
}
function removeRow(index: number) {
    rows.splice(index, 1);
}
function SaveSet() {
    console.log("Settet er lagret");
}
</script>