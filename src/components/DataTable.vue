<script setup lang="ts" generic="TData">
import {
  FlexRender,
  getCoreRowModel,
  useVueTable,
  type ColumnDef,
} from '@tanstack/vue-table'
import type { HTMLAttributes } from 'vue'
import { cn } from '../lib/utils'
import Table from './ui/Table.vue'
import TableBody from './ui/TableBody.vue'
import TableCell from './ui/TableCell.vue'
import TableHead from './ui/TableHead.vue'
import TableHeader from './ui/TableHeader.vue'
import TableRow from './ui/TableRow.vue'

interface DataTableProps {
  data: TData[]
  columns: ColumnDef<TData, any>[]
  loading?: boolean
  loadingRowCount?: number
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<DataTableProps>(), {
  loadingRowCount: 5,
})

const table = useVueTable({
  get data() {
    return props.data
  },
  get columns() {
    return props.columns
  },
  getCoreRowModel: getCoreRowModel(),
})
</script>

<template>
  <div :class="cn('rounded-md border', props.class)">
    <Table>
      <TableHeader>
        <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
          <TableHead v-for="header in headerGroup.headers" :key="header.id">
            <FlexRender
              v-if="!header.isPlaceholder"
              :render="header.column.columnDef.header"
              :props="header.getContext()"
            />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <template v-if="loading">
          <TableRow v-for="n in loadingRowCount" :key="n">
            <TableCell v-for="column in table.getAllColumns()" :key="column.id">
              <div class="h-4 w-full animate-pulse rounded bg-muted" />
            </TableCell>
          </TableRow>
        </template>
        <template v-else-if="table.getRowModel().rows?.length">
          <TableRow v-for="row in table.getRowModel().rows" :key="row.id">
            <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
              <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
            </TableCell>
          </TableRow>
        </template>
        <TableRow v-else>
          <TableCell :colspan="columns.length" class="h-24 text-center">
            No results.
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>
