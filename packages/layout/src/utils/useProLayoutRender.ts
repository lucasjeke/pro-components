import type { ProLayoutProps } from '../ProLayout'
import type { SlotsRenderType } from '../RenderTypings'
import { getSlot } from '@antdv-next1/pro-utils'
import { computed } from 'vue'

export function useProLayoutRender(slots: SlotsRenderType, props: ProLayoutProps) {
  return computed(() => {
    const footerRender = getSlot(slots, props, 'footerRender')
    const actionsRender = getSlot(slots, props, 'actionsRender')
    const collapsedButtonRender = getSlot(
      slots,
      props,
      'collapsedButtonRender',
    )
    const appListRender = getSlot(slots, props, 'appListRender')
    const headerRender = getSlot(slots, props, 'headerRender')
    const headerTitleRender = getSlot(slots, props, 'headerTitleRender')
    const headerContentRender = getSlot(slots, props, 'headerContentRender')

    // menu
    const menuRender = getSlot(slots, props, 'menuRender')
    const menuItemRender = getSlot(slots, props, 'menuItemRender')
    const subMenuItemRender = getSlot(slots, props, 'subMenuItemRender')
    const menuHeaderRender = getSlot(slots, props, 'menuHeaderRender')
    const menuContentRender = getSlot(slots, props, 'menuContentRender')
    const menuExtraRender = getSlot(slots, props, 'menuExtraRender')
    const menuFooterRender = getSlot(slots, props, 'menuFooterRender')
    const multiTabRender = getSlot(slots, props, 'multiTabRender')
    // errorBoundary
    const errorBoundaryRender = getSlot(slots, props, 'errorBoundaryRender')
    return {
      headerRender,
      footerRender,
      menuRender,
      menuHeaderRender,
      menuItemRender,
      subMenuItemRender,
      menuExtraRender,
      menuContentRender,
      headerContentRender,
      headerTitleRender,
      appListRender,
      actionsRender,
      collapsedButtonRender,
      errorBoundaryRender,
      menuFooterRender,
      multiTabRender,
    }
  })
}
