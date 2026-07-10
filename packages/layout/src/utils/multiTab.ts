import type { MultiTabProps } from '../components/MultiTab'

export interface ResolveMultiTabPropsOptions {
  multiTab?: boolean | MultiTabProps
  multiTabProps?: MultiTabProps
}

export function resolveMultiTabProps(options: ResolveMultiTabPropsOptions): MultiTabProps | false | undefined {
  const { multiTab, multiTabProps } = options
  if (multiTabProps)
    return multiTabProps
  if (typeof multiTab === 'object')
    return multiTab
  if (multiTab === true)
    return {}
  if (multiTab === false)
    return false
  return undefined
}
