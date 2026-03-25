<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
  dot?: string
}

const props = withDefaults(
  defineProps<{
    modelValue: string | number | null
    options: Array<SelectOption>
    placeholder?: string
    clearable?: boolean
    disabled?: boolean
    label?: string
  }>(),
  {
    placeholder: 'Select an option...',
    clearable: false,
    disabled: false,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number | null): void
  (e: 'change', option: SelectOption | null): void
}>()

const isOpen = ref(false)
const searchQuery = ref('')
const containerRef = ref<HTMLElement | null>(null)
const searchRef = ref<HTMLInputElement | null>(null)

const selectedOption = computed(
  () => props.options.find((o) => o.value === props.modelValue) ?? null,
)

function toggle() {
  if (props.disabled) return
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    setTimeout(() => searchRef.value?.focus(), 50)
  }
}

function select(option: SelectOption) {
  if (option.disabled) return
  emit('update:modelValue', option.value)
  emit('change', option)
  isOpen.value = false
  searchQuery.value = ''
}

function clear(e: MouseEvent) {
  e.stopPropagation()
  emit('update:modelValue', null)
  emit('change', null)
}

function handleOutsideClick(e: MouseEvent) {
  if (containerRef.value && !containerRef.value.contains(e.target as Node)) {
    isOpen.value = false
    searchQuery.value = ''
  }
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    isOpen.value = false
    searchQuery.value = ''
  }
}

onMounted(() => {
  document.addEventListener('click', handleOutsideClick)
  document.addEventListener('keydown', handleKeydown)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', handleOutsideClick)
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div class="cs-field">
    <label v-if="label" class="cs-label">{{ label }}</label>

    <div ref="containerRef" class="cs" :class="{ 'cs--disabled': disabled }">
      <div
        class="cs-trigger"
        :class="{ 'cs-trigger--open': isOpen }"
        @click="toggle"
        role="combobox"
        :aria-expanded="isOpen"
        :aria-disabled="disabled"
        tabindex="0"
        @keydown.enter.prevent="toggle"
        @keydown.space.prevent="toggle"
      >
        <span v-if="selectedOption" class="cs-value">
          <span
            v-if="selectedOption.dot"
            class="cs-dot"
            :style="{ background: selectedOption.dot }"
          />
          {{ selectedOption.label }}
        </span>
        <span v-else class="cs-placeholder">{{ placeholder }}</span>

        <button
          v-if="clearable && selectedOption"
          class="cs-clear"
          @click="clear"
          type="button"
          aria-label="Clear"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M2 2l8 8M10 2l-8 8"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
            />
          </svg>
        </button>

        <svg
          class="cs-arrow"
          :class="{ 'cs-arrow--open': isOpen }"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M4 6l4 4 4-4"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>

      <Transition name="cs-drop">
        <div v-if="isOpen" class="cs-dropdown" role="listbox">
          <ul class="cs-list">
            <li
              v-for="option in options"
              :key="option.value"
              class="cs-option"
              :class="{
                'cs-option--selected': modelValue === option.value,
                'cs-option--disabled': option.disabled,
              }"
              @click="select(option)"
              role="option"
              :aria-selected="modelValue === option.value"
            >
              <span v-if="option.dot" class="cs-dot" :style="{ background: option.dot }" />
              {{ option.label }}
              <svg
                v-if="modelValue === option.value"
                class="cs-check"
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
              >
                <path
                  d="M2.5 7l3.5 3.5 5.5-6"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </li>
            <li v-if="options.length === 0" class="cs-empty">No options found</li>
          </ul>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style lang="scss">
.cs-placeholder {
  color: var(--color-text);
}
.cs .cs-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.cs-clear {
  position: absolute;
  right: 36px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: none;
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text);
  transition:
    background 0.1s,
    color 0.1s;
}
.cs-clear:hover {
  background: var(--color-background-mute);
  color: var(--color-text);
}

.cs-arrow {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: var(--color-text);
  transition: transform 0.2s;

  &--open {
    transform: translateY(-50%) rotate(180deg);
  }
}

.cs-dropdown {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  z-index: 100;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  overflow: hidden;
}

.cs-list {
  list-style: none;
  max-height: 220px;
  overflow-y: auto;
  padding: 4px;
}

.cs-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  color: var(--color-text);
  transition: background 0.1s;

  &:hover {
    background: var(--color-background-mute);
  }
  &--selected {
    background: #e6f1fb;
    color: #0c447c;
    font-weight: 500;
  }
  &--selected:hover {
    background: #dbeafe;
  }
  &--disabled {
    opacity: 0.4;
    cursor: not-allowed;
    pointer-events: none;
  }
}

.cs-check {
  margin-left: auto;
  color: #378add;
}
.cs-empty {
  padding: 16px;
  text-align: center;
  font-size: 13px;
  color: var(--color-text);
}

.cs-drop-enter-active {
  transition:
    opacity 0.15s,
    transform 0.15s;
}
.cs-drop-leave-active {
  transition: opacity 0.1s;
}
.cs-drop-enter-from {
  opacity: 0;
  transform: translateY(-6px);
}
.cs-drop-leave-to {
  opacity: 0;
}
</style>
