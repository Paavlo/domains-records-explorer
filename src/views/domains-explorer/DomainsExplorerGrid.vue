<script setup lang="ts">
import GridFilter from '@/components/GridFilter.vue'
import DeSelect from '@/components/BaseSelect.vue'
import { ref } from 'vue'
import BaseTable from '@/components/BaseTable.vue'
import type { TableHeader } from '@/types/tables.ts'
import type { Domain } from '@/types/domains.ts'
import DomainPopup from '@/views/domains-explorer/components/DomainPopup.vue'
import statuses from '@/views/domains-explorer/models/statuses.ts'
import StatusBadge from '@/views/domains-explorer/components/StatusBadge.vue'
import { domainService } from '@/services/domain-service.ts'
import { filterDomains } from '@/utilities/domain-filtering.ts'

const tableRef = ref<InstanceType<typeof BaseTable> | null>(null)
const options = statuses
const resetFilter = () => ({
  domain: '',
  registrar: '',
  status: null,
})

const filter = ref(resetFilter())

const headerList = [
  { headerTitle: 'Domain Name', itemKey: 'domain' },
  { headerTitle: 'Registrar', itemKey: 'registrar' },
  { headerTitle: 'Status', itemKey: 'status' },
] as Array<TableHeader>

const filteredDomains = ref<Domain[]>([])
const selectedDomain = ref<Domain | null>(null)
const loading = ref(false)
const errorState = ref<string | null>(null)

const searchForResults = async (): Promise<void> => {
  loading.value = true
  errorState.value = null

  try {
    const domains = await domainService.fetchDomains()

    tableRef.value?.resetPage()

    filteredDomains.value = filterDomains(domains, filter.value)
  } catch (error: unknown) {
    errorState.value = error instanceof Error ? error.message : String(error)
  } finally {
    loading.value = false
  }
}

const clearFilters = (): void => {
  filter.value = resetFilter()
  tableRef.value?.resetPage()
  errorState.value = null
  filteredDomains.value = []
}

const openDomainDetails = (domain: Domain): void => {
  selectedDomain.value = domain
}

const closeDomainDetails = (): void => {
  selectedDomain.value = null
}
</script>

<template>
  <div class="domains-list">
    <GridFilter @search="searchForResults" @clear="clearFilters">
      <template #fields>
        <cs-text-field v-model="filter.domain" label="Domain Name" />

        <cs-text-field v-model="filter.registrar" label="Registrar" />

        <de-select v-model="filter.status" label="Status" :options="options" />
      </template>
    </GridFilter>

    <BaseTable
      ref="tableRef"
      class=""
      clickable
      :header-list="headerList"
      :items="filteredDomains"
      :loading="loading"
      :error-message="errorState"
      @rowClick="openDomainDetails"
    >
      <template #cell-status="{ row }">
        <div>
          <StatusBadge :status="row.status" />
        </div>
      </template>
    </BaseTable>

    <DomainPopup :domain="selectedDomain" :open="!!selectedDomain" @close="closeDomainDetails" />
  </div>
</template>

<style lang="scss">
.domains-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 16px;
}
</style>
