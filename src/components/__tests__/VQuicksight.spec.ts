import VQuicksight from '../VQuicksight.vue'
import { EmbeddingContextInjectionKey } from '../../symbols'
import { mount, shallowMount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { inject, nextTick } from 'vue'

describe('VQuicksight', () => {
  it('renders as expected with default CSS class', () => {
    const component = shallowMount(VQuicksight)
    expect(component.element).toMatchSnapshot()
  })

  it('renders as expected with custom CSS class', () => {
    const component = shallowMount(VQuicksight, { props: { className: 'my-class' } })
    expect(component.element).toMatchSnapshot()
  })

  describe('Integration tests', () => {
    function setupComponents() {
      const ChildComponent = {
        template: '',
        setup() {
          return {
            ctx: inject(EmbeddingContextInjectionKey)
          }
        }
      }
      const component = mount(VQuicksight, {
        slots: {
          default: ChildComponent
        }
      })
      const child = component.findComponent(ChildComponent)
      return { component, child }
    }

    it('provides an embeddingContext which can be injected in a child component', async () => {
      const { child } = setupComponents()
      expect(child.vm.ctx).toBeUndefined()
      await nextTick()
      expect(child.vm.ctx).toEqual(
        expect.objectContaining({
          embedConsole: expect.anything(),
          embedDashboard: expect.anything(),
          embedQSearchBar: expect.anything(),
          embedVisual: expect.anything()
        })
      )
    })
  })
})
