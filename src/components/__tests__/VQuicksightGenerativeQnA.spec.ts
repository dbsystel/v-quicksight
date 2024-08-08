import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'

import { EmbeddingContextInjectionKey } from '../../symbols'
import VQuicksightGenerativeQnA from '../VQuicksightGenerativeQnA.vue'

const frameOptions = {
  container: '#custom-el',
  width: '300px',
  height: '700px',
  withIframePlaceholder: true,
  className: 'my-custom-class'
}
const contentOptions = {
  showTopicName: false,
  showPinboard: false,
  allowTopicSelection: false,
  allowFullscreen: false,
  searchPlaceholderText: ''
}

describe('VQuicksightGenerativeQnA', () => {
  function setupComponent(props: Record<string, any> = {}) {
    const qnaFrame = {
      close: vi.fn().mockResolvedValue({ success: true }),
      setQuestion: vi.fn().mockResolvedValue({ success: true })
    }
    const embeddingContext = {
      embedGenerativeQnA: vi.fn().mockResolvedValue(qnaFrame)
    }

    const component = mount(VQuicksightGenerativeQnA, {
      global: {
        provide: {
          [EmbeddingContextInjectionKey]: ref(embeddingContext)
        }
      },
      props: {
        ...props,
        url: 'https://my-embed-url.example.org',
        id: 'v-quicksight-qna-1'
      }
    })
    return { component, qnaFrame, embeddingContext }
  }

  it('renders as expected', () => {
    const { component } = setupComponent()
    expect(component.element).toMatchSnapshot()
  })

  it('should call embedQSearchBar with default parameters', async () => {
    const { embeddingContext } = setupComponent()
    await nextTick()
    expect(embeddingContext.embedGenerativeQnA).toHaveBeenCalledOnce()
    expect(embeddingContext.embedGenerativeQnA).toHaveBeenCalledWith(
      {
        className: undefined,
        container: '#v-quicksight-qna-1',
        height: '100%',
        onChange: expect.anything(),
        url: 'https://my-embed-url.example.org',
        width: '100%',
        withIframePlaceholder: false
      },
      {
        showTopicName: true,
        showPinboard: true,
        allowTopicSelection: true,
        allowFullscreen: true,
        onMessage: expect.anything()
      }
    )
  })

  it('should call embedQSearchBar with customized parameters', () => {
    const { embeddingContext } = setupComponent({ ...frameOptions, ...contentOptions })
    expect(embeddingContext.embedGenerativeQnA).toHaveBeenCalledOnce()
    expect(embeddingContext.embedGenerativeQnA).toHaveBeenCalledWith(
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
    const { qnaFrame, component } = setupComponent()
    await nextTick() // wait until first setup is finished
    await component.setProps({ url: '', question: 'How many apples were sold?' })
    expect(qnaFrame.setQuestion).toHaveBeenCalledOnce()
    expect(qnaFrame.setQuestion).toHaveBeenCalledWith('How many apples were sold?')
  })

  it('should call close when the question changes to a nullish value', async () => {
    const { qnaFrame, component } = setupComponent({ question: 'How many apples were sold?' })
    await nextTick() // wait until first setup is finished
    await component.setProps({ url: '', question: '' })
    expect(qnaFrame.close).toHaveBeenCalled()
  })
})
