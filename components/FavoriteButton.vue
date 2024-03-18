<template>
    <div class="favorite-button cursor-pointer ml-2" @click.stop="toggleFavorite" variant="default">
        <img :src="StarFilledIcon" v-if="isFavorite" class="star-fill h-5 w-5 filled">
        <img :src="StarIcon" v-else class="star-outline h-5 w-5">
    </div>
</template>

<style>
.star-fill {
    filter: drop-shadow(0px 1px 0.5px rgb(0.5 0.5 0.5 / 0.4));
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