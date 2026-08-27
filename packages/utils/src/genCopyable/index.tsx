import type { TooltipProps } from 'antdv-next'
import type { FormItemTooltipType } from 'antdv-next/dist/form/FormItemLabel'
import type { ProFieldValueEnumType, ProFieldValueType, VueNode } from '../typing'
import { isObject } from '@v-c/util/dist/utils/set'
import { TypographyText } from 'antdv-next'
import { isVNode } from 'vue'

export interface ProEllipsisTooltip {
  showTitle?: boolean
  tooltip?: TooltipProps
}

export type ProEllipsis = ProEllipsisTooltip | boolean

function isNeedTranText(item: {
  valueType?: ProFieldValueType
  valueEnum?: ProFieldValueEnumType
}): boolean {
  if (item?.valueType?.toString().startsWith('date')) {
    return true
  }
  return !!(item?.valueType === 'select' || item?.valueEnum)
}

function getEllipsis(item: {
  ellipsis?: ProEllipsis
}) {
  if (typeof item.ellipsis !== 'boolean' && item.ellipsis?.showTitle === false) {
    return false
  }
  return item.ellipsis
}

function normalizeCopyText(text: VueNode) {
  // Avoid copying non-string values and trim end to prevent trailing spaces.
  // (e.g. some browsers may include Typography's copy separator whitespace)
  return text === null || text === undefined ? '' : String(text).trimEnd()
}

function genEllipsis(dom: VueNode, item: {
  copyable?: boolean
  ellipsis?: ProEllipsis
  tooltip?: FormItemTooltipType
  valueType?: ProFieldValueType
  valueEnum?: ProFieldValueEnumType
}, text: string, rawText: unknown) {
  const ellipsis = getEllipsis(item)
  if (!ellipsis) {
    return false
  }
  /** 有些 valueType 需要设置copy的为string */
  const needTranText = isNeedTranText(item)

  // renderText 返回 Vue 元素时，使用 dom 作为 tooltip 避免 [object Object]
  const isRenderTextReturningJsx = isVNode(rawText)

  // 支持一下 tooltip 的关闭，合并 ellipsis.tooltip 自定义属性（placement 等）
  if ((needTranText || isRenderTextReturningJsx) && item?.tooltip !== false) {
    const tooltipTitle = <div class="pro-table-tooltip-text">{dom}</div>
    if (typeof ellipsis !== 'boolean' && isObject(ellipsis.tooltip)) {
      return {
        tooltip: {
          title: tooltipTitle,
          ...ellipsis.tooltip,
        },
      }
    }
    return {
      tooltip: tooltipTitle,
    }
  }

  if (!text) {
    return false
  }

  // 如果 ellipsis 是对象且包含 tooltip 属性,合并 tooltip 的属性
  if (typeof ellipsis !== 'boolean' && isObject(ellipsis) && isObject(ellipsis.tooltip)) {
    return {
      tooltip: {
        title: text,
        ...ellipsis.tooltip,
      },
    }
  }
  return {
    tooltip: text,
  }
}

/**
 * 生成 Copyable 或 Ellipsis 的 dom
 * @param {T} dom 渲染后的 DOM 节点
 * @param {object} item 列配置
 * @param {boolean} item.copyable
 * @param {ProEllipsis} item.ellipsis
 * @param {FormItemTooltipType} item.tooltip
 * @param {string} text renderText 的返回值，可能是 string/number 或 React 元素
 * @param {AntVueNode} copyText 用于复制的原始文本，当 renderText 返回 JSX 时避免复制 [object Object]
 */
export function genCopyable(dom: VueNode, item: { copyable?: boolean, ellipsis?: ProEllipsis, tooltip?: FormItemTooltipType }, text: VueNode, copyText?: VueNode) {
  if (!item.copyable && !item.ellipsis)
    return dom

  const normalizedText = normalizeCopyText(text)
  // renderText 返回 JSX 时使用原始文本避免复制 [object Object]
  const resolvedCopyText
    = copyText !== undefined ? normalizeCopyText(copyText) : normalizedText

  const ellipsis = genEllipsis(dom, item, normalizedText, text)

  // `Typography.Text` with `copyable` will render an internal separator whitespace
  // between text and icon. When users "multi-click to select all" in a table cell,
  // that whitespace can be selected and copied, causing pasted text to end with spaces.
  // Render the copy icon in a separate node to keep the selectable text clean.
  if (item.copyable) {
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          maxWidth: '100%',
        }}
      >
        <TypographyText
          ellipsis={ellipsis}
          style={{
            flex: 1,
            minWidth: 0,
            margin: 0,
            padding: 0,
          }}
          copyable={resolvedCopyText ? { text: resolvedCopyText, tooltips: ['', ''] } : false}
        >
          {dom}
        </TypographyText>
      </span>
    )
  }
  return (
    <TypographyText
      style={{
        width: '100%',
        margin: 0,
        padding: 0,
      }}
      ellipsis={ellipsis}
    >
      {dom}
    </TypographyText>
  )
}
