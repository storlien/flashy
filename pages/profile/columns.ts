import { h } from 'vue';
import type { ColumnDef } from '@tanstack/vue-table';
import DropdownAction from '@/components/DataTableDropDown.vue';

type FlashcardSet = {
    id: string,
    name: string
    category: string,
    creator: string,
    cards: number
}

const columns: ColumnDef<FlashcardSet>[] = [
    {
        accessorKey: 'name',
        header: () => h('div', { class: 'text-right' }, 'Navn'),
        cell: ({ row }) => {
            const name = row.getValue('name') as unknown as string;

            return h('div', { class: 'text-right font-medium' }, name);
        },
    },
    {
        accessorKey: 'creator',
        header: () => h('div', { class: 'text-right' }, 'Skaper'),
        cell: ({ row }) => {
            const creator = row.getValue('creator') as unknown as string;

            return h('div', { class: 'text-right font-medium' }, creator);
        },
    },
    {
        accessorKey: 'category',
        header: () => h('div', { class: 'text-right' }, 'Kategori'),
        cell: ({ row }) => {
            const category = row.getValue('category') as unknown as string;

            return h('div', { class: 'text-right font-medium' }, category);
        },
    },
    {
        accessorKey: 'cards',
        header: () => h('div', { class: 'text-right' }, 'Antall Kort'),
        cell: ({ row }) => {
            const cards = Number.parseFloat(row.getValue('cards'));

            return h('div', { class: 'text-right font-medium' }, cards);
        },
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
            const set = row.original

            return h('div', { class: 'relative' }, h(DropdownAction, {
                set: set,
            }))
        },
    },
]

export {
    columns,
    type FlashcardSet,
}