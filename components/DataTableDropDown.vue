// DataTableDropDown.vue
<script setup lang="ts">
import { MoreHorizontal, PencilIcon, Trash2Icon } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import server from '~/classes/server';
import type { FlashcardSet } from '~/classes/models';

const props = defineProps<{
  set: FlashcardSet;
}>();

const router = useRouter();

async function deleteSet(): Promise<void> {
  const success = await server.deleteFlashcardSet(props.set);

  if (success) {
    router.go(0);
  }
}

function editSet(): void {
  // navigateTo('/edit-set');
  const rowId = props.set.id;

  router.push({ path: `/edit-set/${rowId}` });
}

</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="w-8 h-8 p-0" @click.stop>
        <span class="sr-only">Open menu</span>
        <MoreHorizontal class="w-4 h-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <!-- <DropdownMenuLabel>Handlinger</DropdownMenuLabel>
      <DropdownMenuItem @click="copy(payment.id)">
        Copy payment ID
      </DropdownMenuItem>
      <DropdownMenuSeparator /> -->
      <!-- <DropdownMenuItem>Rediger</DropdownMenuItem> -->
      <DropdownMenuItem @click="editSet">
        <PencilIcon class="mr-2 w-4 h-4"></PencilIcon>
        <span>Rediger</span>
      </DropdownMenuItem>
      <DropdownMenuSeparator></DropdownMenuSeparator>
      <DropdownMenuItem @click="deleteSet">
        <Trash2Icon color="#dd1d4a" class="mr-2 w-4 h-4"></Trash2Icon>
        <span class="text-[#dd1d4a]">Slett</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>