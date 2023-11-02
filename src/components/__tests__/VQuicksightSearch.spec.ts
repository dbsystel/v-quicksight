import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'

import { EmbeddingContextInjectionKey } from '../../symbols'
import VQuicksightSearch from '../VQuicksightSearch.vue'

const frameOptions = {
  container: '#custom-el',
  width: '300px',
  height: '700px',
  withIframePlaceholder: true,
  className: 'my-custom-class'
}
const contentOptions = {
  hideTopicName: true,
  theme: 'my-theme',
  allowTopicSelection: false
}

describe('VQuicksightSearch', () => {
  function setupComponent(props: Record<string, any> = {}) {
    const searchFrame = {
      close: vi.fn().mockResolvedValue({ success: true }),
      setQuestion: vi.fn().mockResolvedValue({ success: true })
    }
    const embeddingContext = {
      embedQSearchBar: vi.fn().mockResolvedValue(searchFrame)
    }

    const component = mount(VQuicksightSearch, {
      global: {
        provide: {
          [EmbeddingContextInjectionKey]: ref(embeddingContext)
        }
      },
      props: {
        ...props,
        url: 'https://my-embed-url.example.org',
        id: 'v-quicksight-search-1'
      }
    })
    return { component, searchFrame, embeddingContext }
  }

  it('renders as expected', () => {
    const { component } = setupComponent()
    expect(component.element).toMatchSnapshot()
  })

  it('should call embedQSearchBar with default parameters', async () => {
    const { embeddingContext } = setupComponent()
    await nextTick()
    expect(embeddingContext.embedQSearchBar).toHaveBeenCalledOnce()
    expect(embeddingContext.embedQSearchBar).toHaveBeenCalledWith(
      {
        className: undefined,
        container: '#v-quicksight-search-1',
        height: '100%',
        onChange: expect.anything(),
        url: 'https://my-embed-url.example.org',
        width: '100%',
        withIframePlaceholder: false
      },
      {
        hideTopicName: false,
        allowTopicSelection: true,
        onMessage: expect.anything()
      }
    )
  })

  it('should call embedQSearchBar with customized parameters', () => {
    const { embeddingContext } = setupComponent({ ...frameOptions, ...contentOptions })
    expect(embeddingContext.embedQSearchBar).toHaveBeenCalledOnce()
    expect(embeddingContext.embedQSearchBar).toHaveBeenCalledWith(
      {
        ...frameOptions,
        onChange: expect.anything(),
        url: 'https://my-embed-url.example.org'
      },
      {
        ...contentOptions,
        onMessage: expect.anything()
      }
    )
  })

  it('should call setQuestion when the passed question name changes', async () => {
    const { searchFrame, component } = setupComponent()
    await nextTick() // wait until first setup is finished
    await component.setProps({ question: 'How many apples were sold?' })
    expect(searchFrame.setQuestion).toHaveBeenCalledOnce()
    expect(searchFrame.setQuestion).toHaveBeenCalledWith('How many apples were sold?')
  })

  it('should call close when the question changes to a nullish value', async () => {
    const { searchFrame, component } = setupComponent({ question: 'How many apples were sold?' })
    await nextTick() // wait until first setup is finished
    await component.setProps({ question: '' })
    expect(searchFrame.close).toHaveBeenCalled()
  })
})
