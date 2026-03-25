import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseTextField from '@/components/BaseTextField.vue'

function factory(props = {}) {
  return mount(BaseTextField, {
    props: {
      modelValue: '',
      ...props,
    },
  })
}

describe('AppTextField', () => {
  describe('rendering', () => {
    it('renders the input element', () => {
      const wrapper = factory()
      expect(wrapper.find('input').exists()).toBe(true)
    })

    it('renders input with type text', () => {
      const wrapper = factory()
      expect(wrapper.find('input').attributes('type')).toBe('text')
    })

    it('renders the label element', () => {
      const wrapper = factory({ label: 'Domain name' })
      expect(wrapper.find('.cs-text-field__label').text()).toBe('Domain name')
    })

    it('renders empty label when label prop is not provided', () => {
      const wrapper = factory()
      expect(wrapper.find('.cs-text-field__label').text()).toBe('')
    })

    it('uses label as placeholder', () => {
      const wrapper = factory({ label: 'Domain name' })
      expect(wrapper.find('input').attributes('placeholder')).toBe('Domain name')
    })

    it('reflects modelValue as input value', () => {
      const wrapper = factory({ modelValue: 'example.com' })
      expect((wrapper.find('input').element as HTMLInputElement).value).toBe('example.com')
    })

    it('renders empty input when modelValue is empty string', () => {
      const wrapper = factory({ modelValue: '' })
      expect((wrapper.find('input').element as HTMLInputElement).value).toBe('')
    })
  })

  describe('disabled state', () => {
    it('is not disabled by default', () => {
      const wrapper = factory()
      expect(wrapper.find('input').attributes('disabled')).toBeUndefined()
    })

    it('sets disabled attribute when disabled prop is true', () => {
      const wrapper = factory({ disabled: true })
      expect(wrapper.find('input').element.disabled).toBe(true)
    })

    it('does not emit when input is disabled and user types', async () => {
      const wrapper = factory({ disabled: true })
      await wrapper.find('input').trigger('input')
      expect(wrapper.emitted('update:modelValue')).toBeFalsy()
    })
  })

  describe('maxlength', () => {
    it('sets default maxlength of 255', () => {
      const wrapper = factory()
      expect(wrapper.find('input').attributes('maxlength')).toBe('255')
    })

    it('sets custom maxlength when prop is provided', () => {
      const wrapper = factory({ maxlength: 64 })
      expect(wrapper.find('input').attributes('maxlength')).toBe('64')
    })
  })

  describe('emits', () => {
    it('emits update:modelValue on input', async () => {
      const wrapper = factory()
      const input = wrapper.find('input')
      await input.setValue('hello')
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['hello'])
    })

    it('emits empty string when input is cleared', async () => {
      const wrapper = factory({ modelValue: 'example.com' })
      const input = wrapper.find('input')
      await input.setValue('')
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([''])
    })

    it('emits on every keystroke', async () => {
      const wrapper = factory()
      const input = wrapper.find('input')
      await input.setValue('a')
      await input.setValue('ab')
      await input.setValue('abc')
      expect(wrapper.emitted('update:modelValue')).toHaveLength(3)
    })
  })

  describe('css classes', () => {
    it('applies cs-field class to the wrapper', () => {
      const wrapper = factory()
      expect(wrapper.find('.cs-field').exists()).toBe(true)
    })

    it('applies cs-text-field class to the wrapper', () => {
      const wrapper = factory()
      expect(wrapper.find('.cs-text-field').exists()).toBe(true)
    })

    it('applies cs-label class to the label', () => {
      const wrapper = factory()
      expect(wrapper.find('.cs-label').exists()).toBe(true)
    })

    it('applies cs-trigger class to the input', () => {
      const wrapper = factory()
      expect(wrapper.find('.cs-trigger').exists()).toBe(true)
    })

    it('applies cs-text-field__input class to the input', () => {
      const wrapper = factory()
      expect(wrapper.find('.cs-text-field__input').exists()).toBe(true)
    })
  })
})
