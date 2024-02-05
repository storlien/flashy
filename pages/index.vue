<script setup lang="ts">
import { ref } from 'vue';

const clickCount = ref(0);

function onClick() {
    clickCount.value++;
}
</script>

<template>
    <div>
        <!-- <p>Velkommen til Flashy!</p> -->
        <FlashyButton @click="onClick">
            <!-- <p>Denne knappen har blitt klikket {{ clickCount }} ganger</p> -->
        </FlashyButton>
    </div>
</template>

<style lang="scss">
button {
    position: absolute;
    left: 50%;
    top: 60%;

    transform: translate(-50%, -50%);

    // border: 2px solid gray;
    // border-radius: 5px;
    // padding: 5px 15px;

}
</style>