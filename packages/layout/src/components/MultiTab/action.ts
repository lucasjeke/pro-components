export type LegacyMultiTabAction
  = | 'change'
    | 'close'
    | 'close-other'
    | 'close-left'
    | 'close-right'
    | 'refresh'

export type NormalizedMultiTabAction
  = | 'change'
    | 'close'
    | 'closeOther'
    | 'closeLeft'
    | 'closeRight'
    | 'refresh'

export type MultiTabAction = LegacyMultiTabAction | NormalizedMultiTabAction

const legacyActionMap: Partial<Record<MultiTabAction, NormalizedMultiTabAction>> = {
  'close-other': 'closeOther',
  'close-left': 'closeLeft',
  'close-right': 'closeRight',
}

export function normalizeMultiTabAction(action: MultiTabAction): NormalizedMultiTabAction {
  return legacyActionMap[action] || action as NormalizedMultiTabAction
}
