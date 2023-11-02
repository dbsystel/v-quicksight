import VQuicksightConsole from '../VQuicksightConsole.vue'
import { EmbeddingContextInjectionKey } from '../../symbols'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'

const frameOptions = {
  container: '#custom-el',
  width: '300px',
  height: '700px',
  withIframePlaceholder: true,
  className: 'my-custom-class'
}
const contentOptions = {
  locale: 'en-US'
}

describe('VQuicksightConsole', () => {
  function setupComponent(props: Record<string, any> = {}) {
    const embeddingContext = {
      embedConsole: vi.fn().mockResolvedValue({})
    }

    const component = mount(VQuicksightConsole, {
      global: {
        provide: {
          [EmbeddingContextInjectionKey]: ref(embeddingContext)
        }
      },
      props: {
        ...props,
        url: 'https://my-embed-url.example.org',
        id: 'v-quicksight-console-1'
      }
    })
    return { component, embeddingContext }
  }

  it('renders as expected', () => {
    const { component } = setupComponent()
    expect(component.element).toMatchSnapshot()
  })

  it('should call embedConsole with default parameters', async () => {
    const { embeddingContext } = setupComponent()
    await nextTick()
    expect(embeddingContext.embedConsole).toHaveBeenCalledOnce()
    expect(embeddingContext.embedConsole).toHaveBeenCalledWith(
      {
        className: undefined,
        container: '#v-quicksight-console-1',
        height: '100%',
        onChange: expect.anything(),
        url: 'https://my-embed-url.example.org',
        width: '100%',
        withIframePlaceholder: false
      },
      {
        locale: undefined,
        onMessage: expect.anything()
      }
    )
  })

  it('should call embedConsole with customized parameters', () => {
    const { embeddingContext } = setupComponent({ ...frameOptions, ...contentOptions })
    expect(embeddingContext.embedConsole).toHaveBeenCalledOnce()
    expect(embeddingContext.embedConsole).toHaveBeenCalledWith(
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
})
