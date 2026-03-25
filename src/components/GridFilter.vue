<script setup lang="ts">
defineEmits<{
  clear: []
  search: []
}>()
</script>

<template>
  <div class="grid-filter">
    <div class="grid-filter__fields">
      <slot name="fields" />
    </div>

    <div class="grid-filter__actions">
      <cs-button text="Clear" @click="$emit('clear')" />

      <cs-button text="Search" @click="$emit('search')" />
    </div>
  </div>
</template>

<style lang="scss">
.grid-filter {
  padding: 4px 12px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  &__fields {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 16px;

    .cs-field {
      flex: 0 0 200px;
    }
  }

  &__actions {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 16px;
  }
}
</style>
