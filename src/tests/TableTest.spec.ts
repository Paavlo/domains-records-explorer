import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseTable from '@/components/BaseTable.vue' // adjust path

type Header = { headerTitle: string; itemKey: string }

const headers: Header[] = [
  { headerTitle: 'Name', itemKey: 'name' },
  { headerTitle: 'Age', itemKey: 'age' },
]

const generateItems = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    name: `User ${i + 1}`,
    age: i + 20,
  }))

describe('BaseTable.vue', () => {
  it('renders headers correctly', () => {
    const wrapper = mount(BaseTable, {
      props: {
        headerList: headers,
        items: [],
      },
    })

    const ths = wrapper.findAll('th')
    expect(ths).toHaveLength(headers.length)
    expect(ths[0].text()).toBe('Name')
    expect(ths[1].text()).toBe('Age')
  })

  it('renders rows without pagination', () => {
    const items = generateItems(3)

    const wrapper = mount(BaseTable, {
      props: {
        headerList: headers,
        items,
        hasPagination: false,
      },
    })

    const rows = wrapper.findAll('tbody tr')
    expect(rows).toHaveLength(3)
  })

  it('renders only visible rows with pagination', () => {
    const items = generateItems(30)

    const wrapper = mount(BaseTable, {
      props: {
        headerList: headers,
        items,
        itemsPerPage: 20,
      },
    })

    const rows = wrapper.findAll('tbody tr')
    expect(rows).toHaveLength(20)
  })

  it('shows loading skeletons', () => {
    const wrapper = mount(BaseTable, {
      props: {
        headerList: headers,
        items: [],
        loading: true,
        itemsPerPage: 20,
      },
    })

    const skeletons = wrapper.findAll('.skeleton')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('shows empty state text', () => {
    const wrapper = mount(BaseTable, {
      props: {
        headerList: headers,
        items: [],
        loading: false,
        emptyText: 'Nothing here',
      },
    })

    expect(wrapper.find('.empty').text()).toBe('Nothing here')
  })

  it('shows error message instead of empty text', () => {
    const wrapper = mount(BaseTable, {
      props: {
        headerList: headers,
        items: [],
        errorMessage: 'Error occurred',
      },
    })

    expect(wrapper.find('.empty').text()).toBe('Error occurred')
  })

  it('emits row-click when clickable', async () => {
    const items = generateItems(2)

    const wrapper = mount(BaseTable, {
      props: {
        headerList: headers,
        items,
        clickable: true,
      },
    })

    const firstRow = wrapper.find('tbody tr')
    await firstRow.trigger('click')

    expect(wrapper.emitted('row-click')).toBeTruthy()
    expect(wrapper.emitted('row-click')![0][0]).toEqual(items[0])
  })

  it('does not emit row-click when not clickable', async () => {
    const items = generateItems(2)

    const wrapper = mount(BaseTable, {
      props: {
        headerList: headers,
        items,
        clickable: false,
      },
    })

    const firstRow = wrapper.find('tbody tr')
    await firstRow.trigger('click')

    expect(wrapper.emitted('row-click')).toBeFalsy()
  })

  it('applies clickable class when enabled', () => {
    const wrapper = mount(BaseTable, {
      props: {
        headerList: headers,
        items: generateItems(1),
        clickable: true,
      },
    })

    expect(wrapper.find('tbody tr').classes()).toContain('clickable')
  })

  it('handles pagination next/prev buttons', async () => {
    const items = generateItems(25)

    const wrapper = mount(BaseTable, {
      props: {
        headerList: headers,
        items,
        itemsPerPage: 20,
      },
    })

    const buttons = wrapper.findAll('.pg-btn')

    // click next
    await buttons[buttons.length - 1].trigger('click')

    expect(wrapper.find('.pg-info').text()).toContain('1–25')
  })

  it('changes page via page numbers', async () => {
    const items = generateItems(50)

    const wrapper = mount(BaseTable, {
      props: {
        headerList: headers,
        items,
        itemsPerPage: 20,
      },
    })

    const pageBtn = wrapper.findAll('.pg-btn').find((btn) => btn.text() === '2')
    expect(pageBtn).toBeTruthy()

    await pageBtn!.trigger('click')

    expect(wrapper.find('.pg-info').text()).toContain('1–40')
  })

  it('changes items per page', async () => {
    const items = generateItems(50)

    const wrapper = mount(BaseTable, {
      props: {
        headerList: headers,
        items,
      },
    })

    const select = wrapper.find('select')
    await select.setValue('20')

    expect(wrapper.findAll('tbody tr')).toHaveLength(20)
  })

  it('renders slot content for cell', () => {
    const wrapper = mount(BaseTable, {
      props: {
        headerList: headers,
        items: [{ name: 'John', age: 30 }],
        hasPagination: false,
      },
      slots: {
        'cell-name': `<template #default="{ value }"><span class="custom">{{ value }}!</span></template>`,
      },
    })

    expect(wrapper.find('.custom').text()).toBe('John!')
  })

  it('uses fallback value for missing cell data', () => {
    const wrapper = mount(BaseTable, {
      props: {
        headerList: headers,
        items: [{ name: 'John' }], // no age
        hasPagination: false,
      },
    })

    const tds = wrapper.findAll('td')
    expect(tds[1].text()).toBe('—')
  })

  it('computes correct page info', () => {
    const items = generateItems(25)

    const wrapper = mount(BaseTable, {
      props: {
        headerList: headers,
        items,
        itemsPerPage: 20,
      },
    })

    expect(wrapper.find('.pg-info').text()).toBe('1–20 of 25')
  })

  it('resetPage resets current page to 1', async () => {
    const items = generateItems(50)

    const wrapper = mount(BaseTable, {
      props: {
        headerList: headers,
        items,
        itemsPerPage: 20,
      },
    })

    // go to page 2
    const page2 = wrapper.findAll('.pg-btn').find((btn) => btn.text() === '2')
    await page2!.trigger('click')

    expect(wrapper.find('.pg-info').text()).toContain('1–40')

    // call exposed method
    ;(wrapper.vm as any).resetPage()

    await wrapper.vm.$nextTick()

    expect(wrapper.find('.pg-info').text()).toContain('1–20')
  })

  it('disables prev button on first page', () => {
    const wrapper = mount(BaseTable, {
      props: {
        headerList: headers,
        items: generateItems(10),
      },
    })

    const prevBtn = wrapper.findAll('.pg-btn')[0]
    expect(prevBtn.attributes('disabled')).toBeDefined()
  })
})
