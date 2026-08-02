export const inBrowser = typeof document !== 'undefined'

const copySvg = `<svg viewBox="64 64 896 896" focusable="false" data-icon="copy" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M832 64H296c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h496v688c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V96c0-17.7-14.3-32-32-32zM704 192H192c-17.7 0-32 14.3-32 32v530.7c0 8.5 3.4 16.6 9.4 22.6l173.3 173.3c2.2 2.2 4.7 4 7.4 5.5v1.9h4.2c3.5 1.3 7.2 2 11 2H704c17.7 0 32-14.3 32-32V224c0-17.7-14.3-32-32-32zM350 856.2L263.9 770H350v86.2zM664 888H414V746c0-22.1-17.9-40-40-40H232V264h432v624z"></path></svg>`
const copiedSvg = `<svg viewBox="64 64 896 896" focusable="false" data-icon="copy" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474a32 32 0 0 0-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z"></path></svg>`

const CODE_BLOCK_SELECTOR = 'div[class*="language-"]'
const COPY_BUTTON_SELECTOR = 'button.copy'
const COPY_ICON_SELECTOR = '.copy-btn-icon'
const IGNORED_CODE_SELECTORS = '.vp-copy-ignore,.diff.remove'
const SHELL_LANGUAGE_RE = /\blanguage-(?:shellscript|shell|bash|sh|zsh)\b/

let copyCodeCleanup: (() => void) | undefined

export function getCopyButton(target: EventTarget | null): HTMLButtonElement | null {
  if (!(target instanceof Element))
    return null

  const button = target.closest<HTMLButtonElement>(COPY_BUTTON_SELECTOR)

  if (button?.parentElement?.matches(CODE_BLOCK_SELECTOR))
    return button

  return null
}

export function getCopyText(codeBlock: HTMLElement): string {
  const codeElement = codeBlock.querySelector<HTMLElement>('pre,code')

  if (!codeElement)
    return ''

  const clone = codeElement.cloneNode(true) as HTMLElement
  clone.querySelectorAll(IGNORED_CODE_SELECTORS).forEach(node => node.remove())

  let text = clone.textContent || ''

  if (SHELL_LANGUAGE_RE.test(codeBlock.className))
    text = text.replace(/^ *(\$|>) /gm, '').trim()

  return text
}

export function useCopyCode() {
  if (!inBrowser)
    return () => {}

  if (copyCodeCleanup)
    return copyCodeCleanup

  const timeoutIdMap = new Map<HTMLElement, ReturnType<typeof setTimeout>>()

  const onClick = (event: MouseEvent) => {
    void handleCopyClick(event, timeoutIdMap)
  }

  window.addEventListener('click', onClick)

  copyCodeCleanup = () => {
    window.removeEventListener('click', onClick)
    timeoutIdMap.forEach(timeoutId => clearTimeout(timeoutId))
    timeoutIdMap.clear()
    copyCodeCleanup = undefined
  }

  return copyCodeCleanup
}

async function handleCopyClick(
  event: MouseEvent,
  timeoutIdMap: Map<HTMLElement, ReturnType<typeof setTimeout>>,
) {
  const button = getCopyButton(event.target)
  const codeBlock = button?.parentElement

  if (!button || !codeBlock)
    return

  await copyToClipboard(getCopyText(codeBlock))
  showCopiedState(button, timeoutIdMap)
}

function showCopiedState(
  button: HTMLButtonElement,
  timeoutIdMap: Map<HTMLElement, ReturnType<typeof setTimeout>>,
) {
  const copyIconEl = button.querySelector<HTMLElement>(COPY_ICON_SELECTOR)

  button.classList.add('copied')
  if (copyIconEl)
    copyIconEl.innerHTML = copiedSvg

  clearTimeout(timeoutIdMap.get(button))
  const timeoutId = setTimeout(() => {
    button.classList.remove('copied')
    if (copyIconEl)
      copyIconEl.innerHTML = copySvg
    button.blur()
    timeoutIdMap.delete(button)
  }, 2000)
  timeoutIdMap.set(button, timeoutId)
}

async function copyToClipboard(text: string) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return
    }
  }
  catch {
    // Fall back to the textarea strategy below.
  }

  const element = document.createElement('textarea')
  const previouslyFocusedElement = document.activeElement

  element.value = text

  // Prevent keyboard from showing on mobile.
  element.setAttribute('readonly', '')

  element.style.contain = 'strict'
  element.style.position = 'absolute'
  element.style.left = '-9999px'
  element.style.fontSize = '12pt'

  const selection = document.getSelection()
  const originalRange = selection
    ? selection.rangeCount > 0 && selection.getRangeAt(0)
    : null

  document.body.appendChild(element)
  element.select()

  element.selectionStart = 0
  element.selectionEnd = text.length

  document.execCommand('copy')
  document.body.removeChild(element)

  if (originalRange) {
    selection!.removeAllRanges()
    selection!.addRange(originalRange)
  }

  if (previouslyFocusedElement)
    (previouslyFocusedElement as HTMLElement).focus()
}
