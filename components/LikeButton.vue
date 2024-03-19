
<template>
  <div class="favorite-button cursor-pointer flex items-center ml-2" @click="toggleLike" variant="default">
    <img :src="HeartFilledIcon" v-if="isLiked" class="heart-fill h-5 w-5 filled">
    <img :src="HeartIcon" v-else class="heart-outline h-5 w-5">
    <span class="ml-1">{{ likeCount }}</span>
  </div>
</template>

  
<script setup lang="ts">
import HeartIcon from '@/assets/icons/heart.svg';
import HeartFilledIcon from '@/assets/icons/heartfilled.svg';
import server from '~/classes/server';
  
let isLiked = false;
let likeCount = 0;

// HVIS TRUE, SÅ SKAL DET VÆRE heart.svg, HVIS FALSE, SÅ SKAL DET VÆRE heart-2.svg
  
//const props = defineProps({});

//const isLiked = computed(() => {}); 
//denne som skal sjekke om brukeren har likt innlegget tidligere og styrer hvilket symbol som vises 
// HVIS TRUE, SÅ SKAL DET VÆRE heart.svg, HVIS FALSE, SÅ SKAL DET VÆRE heart-2.svg


//Funksjon for å legge til eller fjerne like som må endres på
function toggleLike() {}

</script>


