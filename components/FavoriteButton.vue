<template>
    <div class="favorite-button cursor-pointer ml-2" @click.stop="toggleFavorite" variant="default">
        <img :src="HeartFilledIcon" v-if="favorite" class="heart-fill h-5 w-5 filled">
        <img :src="HeartIcon" v-else class="heart-outline h-5 w-5">
    </div>
</template>

<style>
.heart-outline {
    filter: invert(91%) sepia(17%) saturate(0%) hue-rotate(218deg) brightness(90%) contrast(99%);
}

.heart-fill {
    filter: invert(53%) sepia(80%) saturate(3587%) hue-rotate(316deg) brightness(94%) contrast(93%);
}

</style>

<script setup lang="ts">
import HeartIcon from '@/assets/icons/heart.svg';
import HeartFilledIcon from '@/assets/icons/heart-2.svg';

const favorite = ref(false);

function toggleFavorite() {
    favorite.value = !favorite.value;
    console.log(favorite.value);
}

</script>