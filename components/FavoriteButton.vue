<template>
    <div class="favorite-button cursor-pointer ml-2" @click.stop="toggleFavorite" variant="default">
        <img :src="StarFilledIcon" v-if="isFavorite" class="heart-fill h-5 w-5 filled">
        <img :src="StarIcon" v-else class="heart-outline h-5 w-5">
    </div>
</template>

<style>
.heart-outline {
    filter: invert(98%) sepia(64%) saturate(45%) hue-rotate(257deg) brightness(116%) contrast(92%);
}

.heart-fill {
    filter: invert(53%) sepia(80%) saturate(3587%) hue-rotate(316deg) brightness(94%) contrast(93%);
}
</style>

<script setup lang="ts">
import StarIcon from '@/assets/icons/star.svg';
import StarFilledIcon from '@/assets/icons/starfilled.svg';
import server from '~/classes/server';

const props = defineProps({
    setId: {
        type: String,
        required: true,
    }
});

const isFavorite = computed(() => {
    return server.userSettingsCache.favoriteSets.includes(props.setId);
});

async function toggleFavorite() {
    const cache = server.userSettingsCache;
    if (cache.favoriteSets.includes(props.setId)) {
        cache.favoriteSets.splice(cache.favoriteSets.indexOf(props.setId), 1);
        await server.updateFavoriteSets(cache.favoriteSets);
    } else {
        cache.favoriteSets.push(props.setId);
        await server.updateFavoriteSets(cache.favoriteSets);
    }
}
</script>