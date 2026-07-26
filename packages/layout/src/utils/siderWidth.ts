export type SiderLayout = 'side' | 'top' | 'mix' | 'left' | undefined

export interface SiderWidthOptions {
  layout: SiderLayout
  siderWidth: number
  collapsedWidth: number
  firstMenuWidth: number
}

export function getCollapsedSiderWidth({
  layout,
  siderWidth,
  collapsedWidth,
  firstMenuWidth,
}: SiderWidthOptions) {
  if (layout === 'left')
    return Math.min(siderWidth, collapsedWidth + firstMenuWidth)

  return collapsedWidth
}

export function getSiderMenuWidth({
  collapsed,
  hasMenu = true,
  ...options
}: SiderWidthOptions & {
  collapsed?: boolean
  hasMenu?: boolean
}) {
  if (options.layout === 'left' && !hasMenu)
    return options.firstMenuWidth

  if (collapsed)
    return getCollapsedSiderWidth(options)

  return options.siderWidth
}

export function getLeftSecondarySiderCollapsedWidth({
  siderWidth,
  collapsedWidth,
  firstMenuWidth,
}: Omit<SiderWidthOptions, 'layout'>) {
  return Math.max(
    0,
    getCollapsedSiderWidth({
      layout: 'left',
      siderWidth,
      collapsedWidth,
      firstMenuWidth,
    }) - firstMenuWidth,
  )
}
