import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CsButton from '@/components/BaseButton.vue' // adjust path if needed

describe('Button test', () => {
  it('renders correctly with required prop', () => {
    const wrapper = mount(CsButton, {
      props: {
        text: 'Click me',
      },
    })

    const input = wrapper.get('input.cs-button')

    expect(input.exists()).toBe(true)
    expect(input.attributes('type')).toBe('button')
    expect(input.element).toBeInstanceOf(HTMLInputElement)
  })

  it('displays the correct text value', () => {
    const text = 'Submit'

    const wrapper = mount(CsButton, {
      props: { text },
    })

    const input = wrapper.get('input')

    expect((input.element as HTMLInputElement).value).toBe(text)
  })

  it('emits click event when clicked', async () => {
    const wrapper = mount(CsButton, {
      props: {
        text: 'Click',
      },
    })

    const input = wrapper.get('input')

    await input.trigger('click')

    expect(wrapper.emitted()).toHaveProperty('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('emits native event object with click', async () => {
    const wrapper = mount(CsButton, {
      props: {
        text: 'Click',
      },
    })

    const input = wrapper.get('input')

    await input.trigger('click')

    const emitted = wrapper.emitted('click')

    expect(emitted).toBeTruthy()
    const event = emitted![0][0]

    expect(event).toBeInstanceOf(Event)
    expect(event.type).toBe('click')
  })

  it('applies correct CSS class', () => {
    const wrapper = mount(CsButton, {
      props: {
        text: 'Styled',
      },
    })

    const input = wrapper.get('input')

    expect(input.classes()).toContain('cs-button')
  })

  it('updates when prop changes', async () => {
    const wrapper = mount(CsButton, {
      props: {
        text: 'Old text',
      },
    })

    const input = wrapper.get('input')

    expect((input.element as HTMLInputElement).value).toBe('Old text')

    await wrapper.setProps({ text: 'New text' })

    expect((input.element as HTMLInputElement).value).toBe('New text')
  })
})
