import VQuicksightVisual from '../VQuicksightVisual.vue'
import { EmbeddingContextInjectionKey } from '../../symbols'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'

const frameOptions = {
  container: '#custom-el',
  width: '300px',
  height: '700px',
  resizeHeightOnSizeChangedEvent: false,
  withIframePlaceholder: true,
  className: 'my-custom-class'
}
const contentOptions = {
  parameters: [
    {
      Name: 'minimum',
      Values: [10]
    }
  ],
  fitToIframeWidth: false,
  locale: 'en-US'
}

describe('VQuicksightVisual', () => {
  function setupComponent(props: Record<string, any> = {}) {
    const visualFrame = {
      setParameters: vi.fn().mockResolvedValue({ success: true })
    }
    const embeddingContext = {
      embedVisual: vi.fn().mockResolvedValue(visualFrame)
    }

    const component = mount(VQuicksightVisual, {
      global: {
        provide: {
          [EmbeddingContextInjectionKey]: ref(embeddingContext)
        }
      },
      props: {
        ...props,
        url: 'https://my-embed-url.example.org',
        id: 'v-quicksight-visual-1'
      }
    })
    return { component, visualFrame, embeddingContext }
  }

  it('renders as expected', () => {
    const { component } = setupComponent()
    expect(component.element).toMatchSnapshot()
  })

  it('should call embedVisual with default parameters', async () => {
    const { embeddingContext } = setupComponent()
    await nextTick()
    expect(embeddingContext.embedVisual).toHaveBeenCalledOnce()
    expect(embeddingContext.embedVisual).toHaveBeenCalledWith(
      {
        className: undefined,
        container: '#v-quicksight-visual-1',
        height: '100%',
        onChange: expect.anything(),
        resizeHeightOnSizeChangedEvent: true,
        url: 'https://my-embed-url.example.org',
        width: '100%',
        withIframePlaceholder: false
      },
      {
        locale: undefined,
        onMessage: expect.anything(),
        fitToIframeWidth: true,
        parameters: []
      }
    )
  })

  it('should call embedVisual with customized parameters', () => {
    const { embeddingContext } = setupComponent({ ...frameOptions, ...contentOptions })
    expect(embeddingContext.embedVisual).toHaveBeenCalledOnce()
    expect(embeddingContext.embedVisual).toHaveBeenCalledWith(
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

  it('should call setParameters when the passed parameters are changing', async () => {
    const { visualFrame, component } = setupComponent()
    await nextTick() // wait until first setup is finished
    await component.setProps({ url: '', parameters: contentOptions.parameters })
    expect(visualFrame.setParameters).toHaveBeenCalledOnce()
    expect(visualFrame.setParameters).toHaveBeenCalledWith(contentOptions.parameters)
  })
})
