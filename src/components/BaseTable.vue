<script setup lang="ts">
import { ref, computed } from 'vue'
import type { TableHeader, ItemsPerPage } from '@/types/tables.ts'

const props = withDefaults(
  defineProps<{
    headerList: TableHeader[]
    items: Array<Record<string, unknown>>
    clickable?: boolean
    hasPagination?: boolean
    itemsPerPage?: ItemsPerPage
    loading?: boolean
    errorMessage?: string | null
    emptyText?: string
  }>(),
  {
    clickable: false,
    hasPagination: true,
    itemsPerPage: 20,
    loading: false,
    emptyText: 'No data available',
  },
)

const emit = defineEmits<{
  (e: 'row-click', row: Record<string, unknown>): void
}>()

const currentPage = ref(1)
const perPage = ref<ItemsPerPage>(props.itemsPerPage)

const resetPage = () => {
  currentPage.value = 1
}

const totalPages = computed(() => Math.ceil(props.items.length / perPage.value))

const visibleRows = computed(() => {
  if (!props.hasPagination) return props.items
  const start = (currentPage.value - 1) * perPage.value
  return props.items.slice(start, start + perPage.value)
})

const pageInfo = computed(() => {
  const start = (currentPage.value - 1) * perPage.value + 1
  const end = Math.min(currentPage.value * perPage.value, props.items.length)
  return `${start}–${end} of ${props.items.length}`
})

const pageNumbers = computed(() => {
  const total = totalPages.value
  const cur = currentPage.value
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  if (cur <= 4) return [1, 2, 3, 4, 5, '…', total]
  if (cur >= total - 3) return [1, '…', total - 4, total - 3, total - 2, total - 1, total]
  return [1, '…', cur - 1, cur, cur + 1, '…', total]
})

function goTo(p: number | string) {
  if (typeof p === 'number') currentPage.value = p
}

function onPerPageChange(e: Event) {
  perPage.value = Number((e.target as HTMLSelectElement).value) as ItemsPerPage
  currentPage.value = 1
}

function cellValue(row: Record<string, unknown>, key: string): unknown {
  return row[key] ?? '—'
}

function onRowClick(row: Record<string, unknown>) {
  if (props.clickable) emit('row-click', row)
}

defineExpose({ resetPage })
</script>

<template>
  <div class="tbl-outer">
    <table class="tbl">
      <thead>
        <tr>
          <th v-for="h in headerList" :key="h.itemKey">{{ h.headerTitle }}</th>
        </tr>
      </thead>

      <tbody class="tbl__body">
        <template v-if="loading">
          <tr v-for="n in perPage" :key="n">
            <td v-for="h in headerList" :key="h.itemKey">
              <span class="skeleton" />
            </td>
          </tr>
        </template>

        <template v-else-if="!items.length">
          <tr>
            <td :colspan="headerList.length" class="empty">{{ errorMessage || emptyText }}</td>
          </tr>
        </template>

        <template v-else>
          <tr
            v-for="(row, i) in visibleRows"
            :key="i"
            :class="{ clickable }"
            @click="onRowClick(row)"
          >
            <td v-for="h in headerList" :key="h.itemKey">
              <slot :name="`cell-${h.itemKey}`" :value="cellValue(row, h.itemKey)" :row="row">
                {{ cellValue(row, h.itemKey) }}
              </slot>
            </td>
          </tr>
        </template>
      </tbody>
    </table>

    <div v-if="hasPagination && items.length" class="pagination">
      <div class="per-page">
        Rows per page
        <select :value="perPage" @change="onPerPageChange">
          <option :value="20">20</option>
          <option :value="50">50</option>
          <option :value="100">100</option>
        </select>
      </div>

      <span class="pg-info">{{ pageInfo }}</span>

      <div class="pg-controls">
        <button class="pg-btn" :disabled="currentPage === 1" @click="currentPage--">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M10 12L6 8l4-4"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>

        <template v-for="p in pageNumbers" :key="p">
          <span v-if="p === '…'" class="pg-sep">…</span>
          <button v-else class="pg-btn" :class="{ active: p === currentPage }" @click="goTo(p)">
            {{ p }}
          </button>
        </template>

        <button class="pg-btn" :disabled="currentPage === totalPages" @click="currentPage++">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M6 4l4 4-4 4"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.tbl-outer {
  position: relative;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  overflow: hidden;
  background: var(--color-background);
  height: 500px;
  overflow-y: auto;
}

.tbl {
  width: 100%;
  border-collapse: collapse;

  thead {
    position: sticky;
    top: 0;
  }

  &__body {
    max-height: 400px !important;
  }

  thead tr {
    background: #1e293b;
  }

  th {
    padding: 10px 14px;
    font-size: 11px;
    font-weight: 500;
    color: #e2e8f0;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    text-align: left;
    border-right: 1px solid #334155;
    &:last-child {
      border-right: none;
    }
  }

  tbody tr {
    border-top: 1px solid var(--color-border-tertiary);
    transition: background 0.1s;
    &.clickable {
      cursor: pointer;
    }
    &.clickable:hover {
      background: var(--color-background-info);
    }
    &.clickable:active {
      background: #dbeafe;
    }
  }

  td {
    padding: 10px 14px;
    font-size: 13px;
    color: var(--color-text);
    border-right: 1px solid var(--color-border-tertiary);
    vertical-align: middle;
    &:last-child {
      border-right: none;
    }
  }
}

.skeleton {
  display: block;
  height: 13px;
  width: 65%;
  border-radius: 4px;
  background: var(--vt-c-primary);
  animation: pulse 1.4s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.35;
  }
}

.empty {
  padding: 28px;
  text-align: center;
  font-size: 13px;
  color: var(--color-text);
}

.pagination {
  position: sticky;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 9px 14px;
  background-color: var(--color-background);
  border-top: 1px solid var(--color-border);
  flex-wrap: wrap;
}

.per-page {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--color-text-secondary);

  select {
    height: 28px;
    padding: 0 6px;
    font-size: 12px;
    border: 1px solid var(--color-border);
    border-radius: 6px;
    background: var(--color-primary);
    color: var(--color-text);
    cursor: pointer;
  }
}

.pg-info {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.pg-controls {
  display: flex;
  align-items: center;
  gap: 3px;
}

.pg-btn {
  width: 30px;
  height: 30px;
  border-radius: 6px;
  border: 1px solid var(--color-border);
  background: var(--color-primary);
  color: var(--color-text);
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    background 0.1s,
    border-color 0.1s;

  &:hover:not(:disabled) {
    background: var(--color-background-info);
    border-color: #bfdbfe;
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }

  &.active {
    background: #1e293b;
    color: #e2e8f0;
    border-color: #1e293b;
  }
}

.pg-sep {
  font-size: 13px;
  color: var(--color-text);
  padding: 0 3px;
  line-height: 30px;
}
</style>
