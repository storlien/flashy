// DataTableDropDown.vue
<script setup lang="ts">
import { MoreHorizontal } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';

defineProps<{
  set: {
    id: string
  }
}>()

// function copy(id: string) {
//   navigator.clipboard.writeText(id)
// }
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
      <DropdownMenuItem>Rediger</DropdownMenuItem>
      <DropdownMenuItem>Slett</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>set