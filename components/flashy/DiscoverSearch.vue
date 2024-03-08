<template>
  <TagsInput class="px-0 gap-0 w-80" :model-value="search">
    <div class="flex gap-2 flex-wrap items-center px-3">
      <TagsInputItem v-for="item in search" :key="item" :value="item">
        <TagsInputItemText />
        <TagsInputItemDelete />
      </TagsInputItem>
    </div>

    <ComboboxRoot v-model="search" v-model:open="open" v-model:searchTerm="searchTerm" class="w-full">
      <ComboboxAnchor as-child>
        <ComboboxInput placeholder="Kategorier..." as-child>
          <TagsInputInput class="w-full px-3" :class="search.length > 0 ? 'mt-2' : ''" @keydown.enter.prevent />
        </ComboboxInput>
      </ComboboxAnchor>

      <ComboboxPortal>
        <CommandList position="popper"
          class="w-[--radix-popper-anchor-width] rounded-md mt-2 border bg-popover text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2">
          <CommandEmpty />
          <CommandGroup>
            <CommandItem v-for="category in filteredCategories" :key="category" :value="category" @select.prevent="select">
              {{ category }}
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </ComboboxPortal>
    </ComboboxRoot>
  </TagsInput>
</template>

<script setup lang="ts">
import { ComboboxAnchor, ComboboxInput, ComboboxPortal, ComboboxRoot } from 'radix-vue'
import { CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command'
import { TagsInput, TagsInputInput, TagsInputItem, TagsInputItemDelete, TagsInputItemText } from '@/components/ui/tags-input'
import { categories } from '~/classes/categories';

const emit = defineEmits(['update']);

const search = ref<string[]>([]);
const open = ref(false);
const searchTerm = ref('');

function select(ev: any) {
  
  if (typeof ev.detail.value === 'string') {
    searchTerm.value = ''
    search.value.push(ev.detail.value)
  }
  
  if (filteredCategories.value.length === 0) {
    open.value = false
  }

  emit('update', search.value);
}

const filteredCategories = computed(() => {
  return categories.filter(cat => !search.value.includes(cat))
});

</script>

TODO: Category can be a dropdown, not a tags input. 
Instead, make the tags input search for tags

Final result is all sets in that category with those tags

For example:
Programming, [Easy, Typescript]

returns all Easy Typescript sets in the Programming category

Category may be redundant after this, but still nice to show
