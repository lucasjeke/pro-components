import type { VNode } from 'vue'
import { cloneVNode, Fragment, isVNode, Text } from 'vue'

function supportsAutoFocus(node: VNode): boolean {
  if (typeof node.type !== 'object' || node.type === null) {
    return false
  }

  const props = 'props' in node.type ? node.type.props : undefined

  if (!props) {
    return false
  }

  if (Array.isArray(props)) {
    return props.includes('autoFocus')
  }

  // props: { autoFocus: Boolean }
  return 'autoFocus' in props
}

function walk(
  nodes: VNode[],
  autoFocus: boolean,
  found: { value: boolean },
): VNode[] {
  return nodes.map((node) => {
    if (!isVNode(node)) {
      return node
    }

    // Fragment、Comment、Text 继续递归
    if (
      node.type === Fragment
      || node.type === Comment
      || node.type === Text
    ) {
      if (Array.isArray(node.children)) {
        return cloneVNode(node, {
          children: walk(node.children as VNode[], autoFocus, found),
        })
      }

      return node
    }

    // 已经找到过了，后面的直接返回
    if (found.value) {
      return node
    }

    // 找到第一个支持 autoFocus 的组件
    if (supportsAutoFocus(node)) {
      found.value = true

      return cloneVNode(node, {
        ...node.props,
        autoFocus,
      })
    }

    return node
  })
}

/**
 * 将 autoFocus 应用到第一个子节点
 */

export function autoFocusToFirstChild(
  nodes?: VNode[],
  autoFocus?: boolean,
): VNode[] {
  if (!autoFocus || !nodes?.length) {
    return nodes ?? []
  }
  return walk(nodes, autoFocus, { value: false })
}
