import { createHighlighterCore } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'
import bash from 'shiki/langs/bash.mjs'
import vitesseDark from 'shiki/themes/vitesse-dark.mjs'
import vitesseLight from 'shiki/themes/vitesse-light.mjs'

const highlighter = createHighlighterCore({
  themes: [vitesseLight, vitesseDark],
  langs: [bash],
  engine: createJavaScriptRegexEngine(),
})

export async function codeToSourceTokens(source: string, language: string) {
  const instance = await highlighter
  return instance.codeToTokens(source, {
    lang: language,
    themes: {
      light: 'vitesse-light',
      dark: 'vitesse-dark',
    },
    defaultColor: false,
    cssVariablePrefix: '--ant-doc-',
  })
}
