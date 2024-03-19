// DataTableDropDown.vue
<script setup lang="ts">
import { MoreHorizontal, UserRoundXIcon } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import server from '~/classes/server';
import type { FlashcardSet } from '~/classes/models';

const props = defineProps<{
  userId: string;
}>();

const router = useRouter();

async function removeAdmin(): Promise<void> {
  const success = await server.updateRole(props.userId, null);

  if (success) {
    router.go(0);
  }
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
      <DropdownMenuItem @click="removeAdmin">
        <UserRoundXIcon color="#dd1d4a" class="mr-2 w-4 h-4"></UserRoundXIcon>
        <span class="text-[#dd1d4a]">Fjern</span>
    </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>