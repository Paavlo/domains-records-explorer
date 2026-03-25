<script setup lang="ts">
import { type PropType } from 'vue'
import type { Domain } from '@/types/domains.ts'
import StatusBadge from '@/views/domains-explorer/components/StatusBadge.vue'
import statuses from '@/views/domains-explorer/models/statuses.ts'

const props = defineProps({
  domain: { type: [Object] as PropType<Domain | null>, required: true },
  open: { type: Boolean, required: true },
})

const emit = defineEmits<{
  (e: 'close'): void
}>()

function formatDate(iso: string = ''): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

async function copyDetails() {
  const text = [
    `Domain: ${props.domain?.domain}`,
    `Registrar: ${props.domain?.registrar}`,
    `Status: ${props.domain?.status}`,
    `Created: ${formatDate(props.domain?.created_at || '')}`,
    `Expires: ${formatDate(props.domain?.expires_at || '')}`,
    `Updated: ${formatDate(props.domain?.updated_at || '')}`,
    `Nameservers:\n${props.domain?.nameservers.map((ns) => `  • ${ns}`).join('\n')}`,
  ].join('\n')

  await navigator.clipboard.writeText(text)
}
</script>

<template>
  <Teleport to="body">
    <Transition name="backdrop">
      <div v-if="open" class="backdrop" @click.self="emit('close')">
        <div class="dialog" role="dialog" aria-modal="true">
          <div class="dialog__header">
            <div>
              <div class="dialog__title-row">
                <span class="dialog__domain">{{ domain?.domain }}</span>
                <StatusBadge :status="domain?.status" />
              </div>
              <span class="dialog__subtitle">Domain information</span>
            </div>

            <button class="btn-close" @click="emit('close')">✕</button>
          </div>

          <div class="dialog__body">
            <section class="section">
              <p class="section__label">Registration</p>
              <div class="grid-2">
                <div class="field">
                  <span class="field__key">Registrar</span>
                  <span class="field__value">{{ domain?.registrar }}</span>
                </div>
                <div class="field">
                  <span class="field__key">Status</span>

                  <StatusBadge :status="domain?.status" />
                </div>
              </div>
            </section>

            <section class="section">
              <p class="section__label">Dates</p>
              <div class="grid-3">
                <div class="field">
                  <span class="field__key">Created</span>
                  <span class="field__value">{{ formatDate(domain?.created_at) }}</span>
                </div>
                <div class="field">
                  <span class="field__key">Expires</span>
                  <span class="field__value">{{ formatDate(domain?.expires_at) }}</span>
                </div>
                <div class="field">
                  <span class="field__key">Updated</span>
                  <span class="field__value">{{ formatDate(domain?.updated_at) }}</span>
                </div>
              </div>
            </section>

            <section class="section section--last">
              <p class="section__label">Nameservers</p>
              <ul class="nameservers">
                <li v-for="ns in domain?.nameservers" :key="ns" class="nameserver">
                  <span class="nameserver__dot" />
                  <span class="nameserver__value">{{ ns }}</span>
                </li>
              </ul>
            </section>
          </div>

          <div class="dialog__footer">
            <button class="btn btn--secondary" @click="emit('close')">Close</button>
            <button class="btn btn--primary" @click="copyDetails">Copy details</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss">
.backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  z-index: 100;
}

.dialog {
  position: relative;
  background: #fff;
  border-radius: 16px;
  border: 0.5px solid var(--color-border);
  padding: 16px;
  width: 100%;
  max-width: 520px;
  overflow: hidden;

  &__header {
    padding: 20px 24px 16px;
    border-bottom: 0.5px solid var(--color-border);
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
  }

  &__title-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 4px;
  }
  &__domain {
    font-size: 17px;
    font-weight: 500;
    color: #111;
  }
  &__subtitle {
    font-size: 13px;
    color: #888;
  }

  &__body {
    padding: 0 24px;
  }

  &__footer {
    padding: 14px 24px;
    border-top: 0.5px solid var(--color-border);
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }

  .btn-close {
    position: absolute;
    top: 15px;
    right: 15px;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 18px;
    color: #888;
    padding: 4px;
    line-height: 1;
    border-radius: 6px;
  }
  .btn-close:hover {
    background: #f5f5f5;
  }

  .section {
    padding: 16px 0;
    border-bottom: 0.5px solid var(--color-border);
  }
  .section--last {
    border-bottom: none;
  }
  .section__label {
    font-size: 11px;
    font-weight: 500;
    color: #aaa;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    margin: 0 0 10px;
  }

  .grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  .grid-3 {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 12px;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 2px;

    &__key {
      font-size: 12px;
      font-weight: 700;
      color: #888;
    }

    &__value {
      font-size: 14px;
      font-weight: 500;
      color: #111;
    }
  }

  .nameservers {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .nameserver {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 7px 10px;
    background: #f9f9f9;
    border-radius: 8px;
    border: 0.5px solid var(--color-border);

    &__dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #22c55e;
      flex-shrink: 0;
    }
    &__value {
      font-size: 13px;
      font-family: monospace;
      color: #111;
    }
  }

  .btn {
    font-size: 13px;
    padding: 7px 16px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 500;
  }
  .btn--secondary {
    background: none;
    border: 0.5px solid var(--color-border);
    color: #666;
  }
  .btn--secondary:hover {
    background: #f5f5f5;
  }
  .btn--primary {
    background: #eff6ff;
    border: 0.5px solid var(--color-border);
    color: #1d4ed8;
  }
  .btn--primary:hover {
    background: #dbeafe;
  }
}

.backdrop-enter-active,
.backdrop-leave-active {
  transition: opacity 0.2s ease;
}
.backdrop-enter-from,
.backdrop-leave-to {
  opacity: 0;
}
</style>
