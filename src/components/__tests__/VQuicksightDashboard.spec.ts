import VQuicksightDashboard from '../VQuicksightDashboard.vue'
import { EmbeddingContextInjectionKey } from '../../symbols'
import type { ThemeConfiguration } from '../../types'
import { flushPromises, mount } from '@vue/test-utils'
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
  locale: 'en-US',
  sheetOptions: {
    initialSheetId: 'my-sheet-1',
    singleSheet: true,
    emitSizeChangedEventOnSheetChange: true
  },
  toolbarOptions: {
    export: true,
    undoRedo: true,
    reset: true
  },
  attributionOptions: {
    overlayContent: true
  }
}

describe('VQuicksightDashboard', () => {
  function setupComponent(props: Record<string, any> = {}) {
    const dashboardFrame = {
      setParameters: vi.fn().mockResolvedValue({ success: true }),
      navigateToDashboard: vi.fn().mockResolvedValue({ success: true }),
      setTheme: vi.fn().mockResolvedValue({ success: true }),
      setThemeOverride: vi.fn().mockResolvedValue({ success: true })
    }
    const embeddingContext = {
      embedDashboard: vi.fn().mockResolvedValue(dashboardFrame)
    }

    const component = mount(VQuicksightDashboard, {
      global: {
        provide: {
          [EmbeddingContextInjectionKey]: ref(embeddingContext)
        }
      },
      props: {
        ...props,
        url: 'https://my-embed-url.example.org',
        id: 'v-quicksight-dashboard-1'
      }
    })
    return { component, dashboardFrame, embeddingContext }
  }

  it('renders as expected', () => {
    const { component } = setupComponent()
    expect(component.element).toMatchSnapshot()
  })

  it('should call embedDashboard with default parameters', async () => {
    const { embeddingContext } = setupComponent()
    await nextTick()
    expect(embeddingContext.embedDashboard).toHaveBeenCalledOnce()
    expect(embeddingContext.embedDashboard).toHaveBeenCalledWith(
      {
        className: undefined,
        container: '#v-quicksight-dashboard-1',
        height: '100%',
        onChange: expect.anything(),
        resizeHeightOnSizeChangedEvent: true,
        url: 'https://my-embed-url.example.org',
        width: '100%',
        withIframePlaceholder: false
      },
      {
        attributionOptions: {},
        locale: undefined,
        onMessage: expect.anything(),
        parameters: [],
        sheetOptions: {},
        toolbarOptions: {}
      }
    )
  })

  it('should call embedDashboard with customized parameters', () => {
    const { embeddingContext } = setupComponent({ ...frameOptions, ...contentOptions })
    expect(embeddingContext.embedDashboard).toHaveBeenCalledOnce()
    expect(embeddingContext.embedDashboard).toHaveBeenCalledWith(
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

  it('should call navigateToDashboard when the passed dashboard name changes', async () => {
    const { dashboardFrame, component } = setupComponent()
    await nextTick() // wait until first setup is finished
    await component.setProps({ url: '', dashboard: 'another-dashboard' })
    expect(dashboardFrame.navigateToDashboard).toHaveBeenCalledOnce()
    expect(dashboardFrame.navigateToDashboard).toHaveBeenCalledWith('another-dashboard', {
      parameters: []
    })
  })

  it('should call setParameters when the passed parameters are changing', async () => {
    const { dashboardFrame, component } = setupComponent()
    await nextTick() // wait until first setup is finished
    await component.setProps({ url: '', parameters: contentOptions.parameters })
    expect(dashboardFrame.setParameters).toHaveBeenCalledOnce()
    expect(dashboardFrame.setParameters).toHaveBeenCalledWith(contentOptions.parameters)
  })

  it('should call navigateToDashboard when the passed dashboard and the parameters are changing at the same time', async () => {
    const { dashboardFrame, component } = setupComponent()
    await nextTick() // wait until first setup is finished
    await component.setProps({
      url: '',
      dashboard: 'another-dashboard',
      parameters: contentOptions.parameters
    })
    expect(dashboardFrame.navigateToDashboard).toHaveBeenCalledOnce()
    expect(dashboardFrame.navigateToDashboard).toHaveBeenCalledWith('another-dashboard', {
      parameters: contentOptions.parameters
    })
  })

  describe('when setting a theme', () => {
    it('should set a theme ARN', async () => {
      const theme = 'arn:aws:quicksight::aws:theme/SEASIDE'
      const { dashboardFrame } = setupComponent({ theme })
      await flushPromises()
      expect(dashboardFrame.setTheme).toHaveBeenCalledOnce()
      expect(dashboardFrame.setTheme).toHaveBeenCalledWith(theme)
    })

    it('should set a theme ARN once prop changes', async () => {
      const theme = 'arn:aws:quicksight::aws:theme/SEASIDE'
      const { dashboardFrame, component } = setupComponent({ theme })
      await flushPromises()
      await component.setProps({
        theme
      })
      await flushPromises()
      expect(dashboardFrame.setTheme).toHaveBeenCalledOnce()
      expect(dashboardFrame.setTheme).toHaveBeenCalledWith(theme)
    })

    it('should set an overriding theme config', async () => {
      const theme: ThemeConfiguration = {
        UIColorPalette: {
          PrimaryForeground: '#abcdef',
          SecondaryForeground: '#123456'
        },
        DataColorPalette: {
          Colors: ['#abcdef', '#123456']
        }
      }
      const { dashboardFrame } = setupComponent({ theme })
      await flushPromises()
      expect(dashboardFrame.setThemeOverride).toHaveBeenCalledOnce()
      expect(dashboardFrame.setThemeOverride).toHaveBeenCalledWith(theme)
    })

    it('should set an overriding theme config once prop changes', async () => {
      const theme: ThemeConfiguration = {
        UIColorPalette: {
          PrimaryForeground: '#abcdef',
          SecondaryForeground: '#123456'
        },
        DataColorPalette: {
          Colors: ['#abcdef', '#123456']
        }
      }
      const { dashboardFrame, component } = setupComponent({ theme })
      await flushPromises()
      await component.setProps({
        theme
      })
      await flushPromises()
      expect(dashboardFrame.setThemeOverride).toHaveBeenCalledOnce()
      expect(dashboardFrame.setThemeOverride).toHaveBeenCalledWith(theme)
    })
  })
})
