<script setup lang="ts">
import { computed } from 'vue'
import statuses from '@/views/domains-explorer/models/statuses.ts'

const props = defineProps({
  status: { type: String, required: false },
})

const statusClass = computed(
  () =>
    ({
      active: 'status--active',
      clientHold: 'status--hold',
      pendingTransfer: 'status--pending',
    })[props.status || ''],
)

const getStatusText = computed((): string => {
  return statuses.find((o) => o.value === props.status)?.label || ''
})
</script>

<template>
  <span class="status-badge" :class="statusClass">
    {{ getStatusText }}
  </span>
</template>

<style lang="scss">
.status-badge {
  width: fit-content;
  font-size: 11px;
  font-weight: 500;
  padding: 2px 10px;
  border-radius: 99px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.status--active {
  background: #dcfce7;
  color: #15803d;
}
.status--hold {
  background: #f3f4f6;
  color: #6b7280;
}
.status--pending {
  background: #fef9c3;
  color: #a16207;
}
</style>
