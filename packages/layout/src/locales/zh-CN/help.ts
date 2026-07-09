const zhCN = {
  'app.help.title': '帮助中心',
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
