/**
 * 用于判断当前是否需要开启哈希（Hash）模式。
 *
 * 下列场景返回 `false`（关闭 hash，便于快照/调试）：
 * - env === 'test'`（单元测试快照稳定）
 * - `env === 'development'`（本地开发时样式调试更直观）
 *
 * 其余环境（含生产、未设置 env）一律返回 `true`。
 */
export function isNeedOpenHash() {
  try {
    const env = import.meta.env.MODE?.toLowerCase() || process.env.NODE_ENV?.toLowerCase()
    if (env === 'test' || env === 'development') {
      return false
    }
    return true
  }
  catch (error) {
    return true
  }
}
