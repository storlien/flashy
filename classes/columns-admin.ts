import { h } from 'vue';
import type { ColumnDef } from '@tanstack/vue-table';
import DropdownAction from '@/components/DataTableDropDown.vue';
import type { Flashcard, FlashcardSet } from './models';
import type { UserSettings } from './models';
import AdminDropDown from '~/components/AdminDropDown.vue';

const columnsAdmin: ColumnDef<UserSettings>[] = [
    // {
    //     accessorKey: 'name',
    //     header: () => h('div', {class: 'text-right'}, 'Navn'),
    //     cell: ({ row }) => {
    //         const name = row.getValue('name') as string;
    //         return h('div', { class: 'text-right font medium' }, name);
    //     },
    // },
    {
        accessorKey: 'email',
        header: () => h('div', { class: 'text-left' }, 'E-post'),
        cell: ({ row }) => {
            const email = row.getValue('email') as string;

            return h('div', { class: 'text-left font-medium' }, email);
        },
    },
    {
        accessorKey: 'id',
        header: () => h('div', { class: 'text-left' }, 'ID'),
        cell: ({ row }) => {
            const id = row.getValue('id') as string;

            return h('div', { class: 'text-left font-medium' }, id);
        },
    },
    {
        id: 'delete',
        cell: ({ row }) => {
            const admin = row.original;

            return h('div', { class: 'relative' }, h(AdminDropDown, {
                userId: admin.id ?? '',
            }));
        },
    },
]

export {
    columnsAdmin
}