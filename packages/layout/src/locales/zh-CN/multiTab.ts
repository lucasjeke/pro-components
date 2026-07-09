/**
 * zh-CN 是所有 locale 的**基准**：
 * - 其他 32 个 locale 文件通过 `import type { ProLocale } from './zh_CN'` 复用本文件推断出的类型
 * - 任何一个 locale 缺字段时，TS 会在编译期直接报错（而不是运行时静默 fallback）
 *
 * 新增文案的流程：先在此处加 key，再在各语言文件里补翻译，TS 会全程提示哪些文件还没补。
 */
const zhCN = {
  'app.multiTab.close': '关闭',
  'app.multiTab.closeOther': '关闭其他',
  'app.multiTab.refresh': '刷新当前页',
  'app.multiTab.closeRight': '关闭到右侧',
  'app.multiTab.closeLeft': '关闭到左侧',
}

/** 所有 locale 共享的基准类型，由 zh-CN 推断得出。 */
export type ProLocale = {
  -readonly [K in keyof typeof zhCN]: (typeof zhCN)[K] extends Record<
    string,
    any
  >
    ? { -readonly [P in keyof (typeof zhCN)[K]]: any }
    : string;
}

export default zhCN
