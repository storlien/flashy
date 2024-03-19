
<template>
  <div class="favorite-button cursor-pointer flex items-center ml-2" @click="onChange" variant="default">
    <img :src="HeartFilledIcon" v-if="isLiked" class="heart-fill h-5 w-5 filled">
    <img :src="HeartIcon" v-else class="heart-outline h-5 w-5">
  </div>
</template>

<script setup lang="ts">
import HeartIcon from '@/assets/icons/heart.svg';
import HeartFilledIcon from '@/assets/icons/heartfilled.svg';

const props = defineProps<{
    flashcardSetId: String,
    isLiked: boolean,
    onChange: () => void,
}>()

</script>


