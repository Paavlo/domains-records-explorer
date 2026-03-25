<script setup lang="ts">
defineEmits<{
  click: [event: Event]
}>()

defineProps({
  text: { type: String, required: false },
})
</script>

<template>
  <input class="cs-button" type="button" :value="text" @click="$emit('click', $event)" />
</template>

<style lang="scss">
.cs-button {
  max-width: unset;
  max-height: unset;
  padding: 8px 16px;
  background-color: var(--color-primary);
  color: var(--vt-c-text-dark-1);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background-color: var(--color-primary-dark-1);
  }

  &:active {
    background-color: var(--color-primary-dark-2);
  }
}
</style>
