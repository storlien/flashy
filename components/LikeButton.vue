<!-- <template>
    <div class="favorite-button cursor-pointer ml-2" @click="updateNumberOfLikes" variant="default">
        <img :src="HeartFilledIcon" v-if="isFavorite" class="heart-fill h-5 w-5 filled">
        <img :src="HeartIcon" v-else class="heart-outline h-5 w-5">
    </div>

</template>

<script setup lang="ts">
import HeartIcon from '@/assets/icons/star.svg';
import HeartFilledIcon from '@/assets/icons/starfilled.svg';
import server from '~/classes/server';

const numberOfLikes;

function updateNumberOfLikes(){
    
    if (isFavorite){


    }
}

</script> -->

<template>
    <div class="favorite-button cursor-pointer ml-2" @click="toggleLike" variant="default">
      <img :src="HeartFilledIcon" v-if="liked" class="heart-fill h-5 w-5 filled">
      <img :src="HeartIcon" v-else class="heart-outline h-5 w-5">
      <span>{{ likeCount }}</span>
    </div>
  </template>
  
  <script setup lang="ts">
  import HeartIcon from '@/assets/icons/star.svg';
  import HeartFilledIcon from '@/assets/icons/starfilled.svg';
  import server from '~/classes/server';
  
  let liked = false;
  let likeCount = 0;
  
  // Sjekk om brukeren har likt innlegget tidligere
  if (server.userHasLikedPost(postId)) {
    liked = true;
  }
  
  function toggleLike() {
    if (liked) {
      // Fjern liken
      server.removeLike(postId);
      likeCount--;
    } else {
      // Legg til liken
      server.addLike(postId);
      likeCount++;
    }
    liked = !liked;
  }
  </script>