<script setup lang="ts">
defineProps({
  modelValue: { type: String, default: '' },
  label: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  maxlength: { type: Number, default: 255 },
})

defineEmits<{
  (e: 'update:modelValue', value: string | number | null): void
}>()
</script>

<template>
  <div class="cs-field cs-text-field">
    <label class="cs-label cs-text-field__label">{{ label }} </label>

    <input
      class="cs-trigger cs-text-field__input"
      type="text"
      :value="modelValue"
      :placeholder="label"
      :disabled="disabled"
      :maxlength="maxlength"
      @input="$emit('update:modelValue', $event.target?.value || '')"
    />
  </div>
</template>

<style lang="scss">
.cs-text-field {
  &__input {
    font-weight: 500;
  }
}
</style>
