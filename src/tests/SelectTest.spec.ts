import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseSelect from '@/components/BaseSelect.vue'

const options = [
  { value: 'active', label: 'Active', dot: '#22c55e' },
  { value: 'pending', label: 'Pending', dot: '#f59e0b' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'disabled', label: 'Disabled', disabled: true },
]

function factory(props = {}) {
  return mount(BaseSelect, {
    props: {
      modelValue: null,
      options,
      ...props,
    },
    attachTo: document.body,
  })
}

describe('AppSelect', () => {
  describe('rendering', () => {
    it('renders the trigger element', () => {
      const wrapper = factory()
      expect(wrapper.find('.cs-trigger').exists()).toBe(true)
    })

    it('shows placeholder when no value is selected', () => {
      const wrapper = factory({ placeholder: 'Pick one...' })
      expect(wrapper.find('.cs-placeholder').text()).toBe('Pick one...')
    })

    it('uses default placeholder when none provided', () => {
      const wrapper = factory()
      expect(wrapper.find('.cs-placeholder').text()).toBe('Select an option...')
    })

    it('renders label when label prop is provided', () => {
      const wrapper = factory({ label: 'Status' })
      expect(wrapper.find('.cs-label').text()).toBe('Status')
    })

    it('does not render label when prop is absent', () => {
      const wrapper = factory()
      expect(wrapper.find('.cs-label').exists()).toBe(false)
    })

    it('dropdown is hidden on initial render', () => {
      const wrapper = factory()
      expect(wrapper.find('.cs-dropdown').exists()).toBe(false)
    })

    it('shows selected option label when modelValue is set', () => {
      const wrapper = factory({ modelValue: 'active' })
      expect(wrapper.find('.cs-value').text()).toBe('Active')
    })

    it('renders dot when selected option has dot property', () => {
      const wrapper = factory({ modelValue: 'active' })
      expect(wrapper.find('.cs-value .cs-dot').exists()).toBe(true)
    })

    it('does not render dot when selected option has no dot property', () => {
      const wrapper = factory({ modelValue: 'inactive' })
      expect(wrapper.find('.cs-value .cs-dot').exists()).toBe(false)
    })

    it('does not show clear button when clearable is false', () => {
      const wrapper = factory({ modelValue: 'active', clearable: false })
      expect(wrapper.find('.cs-clear').exists()).toBe(false)
    })

    it('shows clear button when clearable is true and value is set', () => {
      const wrapper = factory({ modelValue: 'active', clearable: true })
      expect(wrapper.find('.cs-clear').exists()).toBe(true)
    })

    it('does not show clear button when clearable is true but no value', () => {
      const wrapper = factory({ modelValue: null, clearable: true })
      expect(wrapper.find('.cs-clear').exists()).toBe(false)
    })
  })

  describe('disabled state', () => {
    it('adds cs--disabled class when disabled prop is true', () => {
      const wrapper = factory({ disabled: true })
      expect(wrapper.find('.cs').classes()).toContain('cs--disabled')
    })

    it('does not open dropdown when disabled', async () => {
      const wrapper = factory({ disabled: true })
      await wrapper.find('.cs-trigger').trigger('click')
      expect(wrapper.find('.cs-dropdown').exists()).toBe(false)
    })
  })

  describe('open / close', () => {
    it('opens dropdown on trigger click', async () => {
      const wrapper = factory()
      await wrapper.find('.cs-trigger').trigger('click')
      expect(wrapper.find('.cs-dropdown').exists()).toBe(true)
    })

    it('closes dropdown on second trigger click', async () => {
      const wrapper = factory()
      await wrapper.find('.cs-trigger').trigger('click')
      await wrapper.find('.cs-trigger').trigger('click')
      expect(wrapper.find('.cs-dropdown').exists()).toBe(false)
    })

    it('adds cs-trigger--open class when open', async () => {
      const wrapper = factory()
      await wrapper.find('.cs-trigger').trigger('click')
      expect(wrapper.find('.cs-trigger').classes()).toContain('cs-trigger--open')
    })

    it('adds cs-arrow--open class on arrow when open', async () => {
      const wrapper = factory()
      await wrapper.find('.cs-trigger').trigger('click')
      expect(wrapper.find('.cs-arrow').classes()).toContain('cs-arrow--open')
    })

    it('closes dropdown on Escape key', async () => {
      const wrapper = factory()
      await wrapper.find('.cs-trigger').trigger('click')
      expect(wrapper.find('.cs-dropdown').exists()).toBe(true)

      await wrapper.find('.cs-trigger').trigger('keydown', { key: 'Escape' })
      expect(wrapper.find('.cs-dropdown').exists()).toBe(false)
    })

    it('opens dropdown on Enter key', async () => {
      const wrapper = factory()
      await wrapper.find('.cs-trigger').trigger('keydown.enter')
      expect(wrapper.find('.cs-dropdown').exists()).toBe(true)
    })

    it('opens dropdown on Space key', async () => {
      const wrapper = factory()
      await wrapper.find('.cs-trigger').trigger('keydown.space')
      expect(wrapper.find('.cs-dropdown').exists()).toBe(true)
    })

    it('closes dropdown when clicking outside', async () => {
      const wrapper = factory()
      await wrapper.find('.cs-trigger').trigger('click')
      expect(wrapper.find('.cs-dropdown').exists()).toBe(true)

      document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.cs-dropdown').exists()).toBe(false)
    })
  })

  describe('option list', () => {
    it('renders all options in the dropdown', async () => {
      const wrapper = factory()
      await wrapper.find('.cs-trigger').trigger('click')
      expect(wrapper.findAll('.cs-option')).toHaveLength(options.length)
    })

    it('marks the selected option with cs-option--selected', async () => {
      const wrapper = factory({ modelValue: 'active' })
      await wrapper.find('.cs-trigger').trigger('click')
      const selected = wrapper
        .findAll('.cs-option')
        .find((o) => o.classes().includes('cs-option--selected'))
      expect(selected?.text()).toContain('Active')
    })

    it('renders check icon on selected option', async () => {
      const wrapper = factory({ modelValue: 'active' })
      await wrapper.find('.cs-trigger').trigger('click')
      const selectedOption = wrapper.findAll('.cs-option')[0]
      expect(selectedOption.find('.cs-check').exists()).toBe(true)
    })

    it('marks disabled option with cs-option--disabled', async () => {
      const wrapper = factory()
      await wrapper.find('.cs-trigger').trigger('click')
      const disabledOption = wrapper
        .findAll('.cs-option')
        .find((o) => o.classes().includes('cs-option--disabled'))
      expect(disabledOption).toBeTruthy()
    })

    it('renders dot element for options that have dot property', async () => {
      const wrapper = factory()
      await wrapper.find('.cs-trigger').trigger('click')
      const firstOption = wrapper.findAll('.cs-option')[0]
      expect(firstOption.find('.cs-dot').exists()).toBe(true)
    })

    it('shows empty state when options array is empty', async () => {
      const wrapper = factory({ options: [] })
      await wrapper.find('.cs-trigger').trigger('click')
      expect(wrapper.find('.cs-empty').exists()).toBe(true)
      expect(wrapper.find('.cs-empty').text()).toBe('No options found')
    })
  })

  describe('selection', () => {
    it('emits update:modelValue with option value on click', async () => {
      const wrapper = factory()
      await wrapper.find('.cs-trigger').trigger('click')
      await wrapper.findAll('.cs-option')[0].trigger('click')
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['active'])
    })

    it('emits change event with full option object', async () => {
      const wrapper = factory()
      await wrapper.find('.cs-trigger').trigger('click')
      await wrapper.findAll('.cs-option')[0].trigger('click')
      expect(wrapper.emitted('change')?.[0]).toEqual([options[0]])
    })

    it('closes dropdown after selection', async () => {
      const wrapper = factory()
      await wrapper.find('.cs-trigger').trigger('click')
      await wrapper.findAll('.cs-option')[0].trigger('click')
      expect(wrapper.find('.cs-dropdown').exists()).toBe(false)
    })

    it('does not emit when disabled option is clicked', async () => {
      const wrapper = factory()
      await wrapper.find('.cs-trigger').trigger('click')
      const disabledOption = wrapper
        .findAll('.cs-option')
        .find((o) => o.classes().includes('cs-option--disabled'))
      await disabledOption?.trigger('click')
      expect(wrapper.emitted('update:modelValue')).toBeFalsy()
    })
  })

  describe('clear button', () => {
    it('emits update:modelValue with null on clear', async () => {
      const wrapper = factory({ modelValue: 'active', clearable: true })
      await wrapper.find('.cs-clear').trigger('click')
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([null])
    })

    it('emits change with null on clear', async () => {
      const wrapper = factory({ modelValue: 'active', clearable: true })
      await wrapper.find('.cs-clear').trigger('click')
      expect(wrapper.emitted('change')?.[0]).toEqual([null])
    })

    it('does not open dropdown when clear is clicked', async () => {
      const wrapper = factory({ modelValue: 'active', clearable: true })
      await wrapper.find('.cs-clear').trigger('click')
      expect(wrapper.find('.cs-dropdown').exists()).toBe(false)
    })
  })

  describe('event listener cleanup', () => {
    it('removes event listeners on unmount', () => {
      const removeSpy = vi.spyOn(document, 'removeEventListener')
      const wrapper = factory()
      wrapper.unmount()
      expect(removeSpy).toHaveBeenCalledWith('click', expect.any(Function))
      expect(removeSpy).toHaveBeenCalledWith('keydown', expect.any(Function))
      removeSpy.mockRestore()
    })
  })
})
