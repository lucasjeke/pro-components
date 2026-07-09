interface Covers {
  [key: string]: {
    cover: string
    coverDark: string
  }
}

type ThemeName = 'light' | 'dark'

interface SvgTheme {
  bg: string
  panel: string
  panelAlt: string
  stroke: string
  strokeStrong: string
  text: string
  muted: string
  primary: string
  primarySoft: string
  success: string
  warning: string
  purple: string
  cyan: string
  shadow: string
}

const themes: Record<ThemeName, SvgTheme> = {
  light: {
    bg: '#f7faff',
    panel: '#ffffff',
    panelAlt: '#f1f6ff',
    stroke: '#d9e4f5',
    strokeStrong: '#9ec5ff',
    text: '#202631',
    muted: '#8a94a6',
    primary: '#1677ff',
    primarySoft: '#d8e9ff',
    success: '#36cfc9',
    warning: '#faad14',
    purple: '#9254de',
    cyan: '#13c2c2',
    shadow: 'rgba(45, 91, 180, 0.12)',
  },
  dark: {
    bg: '#111827',
    panel: '#1f2937',
    panelAlt: '#172033',
    stroke: '#344154',
    strokeStrong: '#2f73d9',
    text: '#e5edf8',
    muted: '#91a0b6',
    primary: '#4096ff',
    primarySoft: '#15345f',
    success: '#36cfc9',
    warning: '#ffc53d',
    purple: '#b37feb',
    cyan: '#5cdbd3',
    shadow: 'rgba(0, 0, 0, 0.34)',
  },
}

function escapeXml(value: string) {
  return value.replace(/[&<>"]/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
  }[char] || char))
}

function svgToDataUri(svg: string) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

function line(x: number, y: number, width: number, color: string, height = 6, radius = 3) {
  return `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}" fill="${color}"/>`
}

function dot(x: number, y: number, color: string, r = 4) {
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}"/>`
}

function shell(theme: SvgTheme, title: string, body: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180" viewBox="0 0 320 180" fill="none" role="img" aria-label="${escapeXml(title)} component preview">
  <rect width="320" height="180" rx="18" fill="${theme.bg}"/>
  <circle cx="46" cy="34" r="44" fill="${theme.primarySoft}" opacity="0.7"/>
  <circle cx="274" cy="148" r="52" fill="${theme.primarySoft}" opacity="0.45"/>
  <rect x="22" y="20" width="276" height="140" rx="16" fill="${theme.panel}" stroke="${theme.stroke}"/>
  <rect x="22" y="20" width="276" height="140" rx="16" fill="url(#grid)" opacity="0.36"/>
  <defs>
    <pattern id="grid" width="18" height="18" patternUnits="userSpaceOnUse">
      <path d="M18 0H0V18" stroke="${theme.stroke}" stroke-width="0.7" opacity="0.55"/>
    </pattern>
    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="${theme.shadow}"/>
    </filter>
  </defs>
  ${body}
</svg>`
}

function layout(theme: SvgTheme) {
  return shell(theme, 'Layout', `
    <rect x="54" y="46" width="212" height="88" rx="10" fill="${theme.panelAlt}" stroke="${theme.strokeStrong}" filter="url(#softShadow)"/>
    <rect x="54" y="46" width="48" height="88" rx="10" fill="${theme.primary}"/>
    <rect x="102" y="46" width="164" height="22" rx="0" fill="${theme.panel}" stroke="${theme.stroke}"/>
    ${line(118, 55, 52, theme.primarySoft)}
    ${line(194, 55, 42, theme.stroke)}
    ${line(70, 66, 18, '#fff', 4, 2)}
    ${line(70, 82, 18, 'rgba(255,255,255,0.58)', 4, 2)}
    ${line(70, 98, 18, 'rgba(255,255,255,0.58)', 4, 2)}
    <rect x="122" y="84" width="52" height="32" rx="6" fill="${theme.panel}" stroke="${theme.stroke}"/>
    <rect x="186" y="84" width="52" height="32" rx="6" fill="${theme.panel}" stroke="${theme.stroke}"/>
  `)
}

function pageContainer(theme: SvgTheme) {
  return shell(theme, 'PageContainer', `
    <rect x="58" y="44" width="204" height="90" rx="10" fill="${theme.panelAlt}" stroke="${theme.strokeStrong}"/>
    ${line(74, 58, 74, theme.text, 8, 4)}
    ${line(74, 76, 118, theme.muted, 5, 3)}
    <rect x="74" y="96" width="156" height="24" rx="6" fill="${theme.panel}" stroke="${theme.stroke}"/>
    ${dot(88, 108, theme.primary, 4)}${line(100, 105, 48, theme.stroke, 5, 3)}${line(164, 105, 38, theme.stroke, 5, 3)}
    <rect x="206" y="56" width="38" height="22" rx="11" fill="${theme.primary}"/>
  `)
}

function card(theme: SvgTheme) {
  return shell(theme, 'Card', `
    <rect x="62" y="48" width="82" height="82" rx="12" fill="${theme.panel}" stroke="${theme.strokeStrong}" filter="url(#softShadow)"/>
    <rect x="176" y="48" width="82" height="82" rx="12" fill="${theme.panel}" stroke="${theme.stroke}"/>
    <rect x="76" y="62" width="54" height="28" rx="7" fill="${theme.primarySoft}"/>
    ${line(76, 102, 44, theme.text, 6, 3)}${line(76, 116, 56, theme.muted, 5, 3)}
    <rect x="190" y="62" width="54" height="28" rx="7" fill="${theme.panelAlt}"/>
    ${line(190, 102, 44, theme.text, 6, 3)}${line(190, 116, 56, theme.muted, 5, 3)}
  `)
}

function statisticCard(theme: SvgTheme) {
  return shell(theme, 'StatisticCard', `
    <rect x="54" y="48" width="212" height="82" rx="12" fill="${theme.panel}" stroke="${theme.strokeStrong}"/>
    ${line(74, 66, 58, theme.muted, 5, 3)}
    <text x="74" y="102" fill="${theme.text}" font-family="Inter, Arial" font-size="28" font-weight="700">72.8%</text>
    <path d="M180 106L202 84L220 96L248 64" stroke="${theme.primary}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M180 120H248" stroke="${theme.stroke}" stroke-width="4" stroke-linecap="round"/>
  `)
}

function checkCard(theme: SvgTheme) {
  return shell(theme, 'CheckCard', `
    <rect x="58" y="48" width="92" height="82" rx="12" fill="${theme.primarySoft}" stroke="${theme.primary}"/>
    <rect x="170" y="48" width="92" height="82" rx="12" fill="${theme.panel}" stroke="${theme.stroke}"/>
    <circle cx="130" cy="68" r="12" fill="${theme.primary}"/>
    <path d="M124 68.5L128.5 73L137 63.5" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    ${line(76, 82, 44, theme.text, 6, 3)}${line(76, 98, 56, theme.muted, 5, 3)}
    ${line(188, 82, 44, theme.text, 6, 3)}${line(188, 98, 56, theme.muted, 5, 3)}
  `)
}

function form(theme: SvgTheme) {
  return shell(theme, 'Form', `
    <rect x="66" y="44" width="188" height="92" rx="12" fill="${theme.panel}" stroke="${theme.strokeStrong}"/>
    ${line(86, 62, 42, theme.muted, 5, 3)}<rect x="138" y="56" width="88" height="18" rx="5" fill="${theme.panelAlt}" stroke="${theme.stroke}"/>
    ${line(86, 90, 42, theme.muted, 5, 3)}<rect x="138" y="84" width="88" height="18" rx="5" fill="${theme.panelAlt}" stroke="${theme.stroke}"/>
    <rect x="138" y="112" width="58" height="18" rx="9" fill="${theme.primary}"/>
  `)
}

function fieldSet(theme: SvgTheme) {
  return shell(theme, 'FieldSet', `
    <rect x="62" y="46" width="196" height="88" rx="12" fill="${theme.panel}" stroke="${theme.strokeStrong}"/>
    <rect x="82" y="62" width="156" height="18" rx="6" fill="${theme.panelAlt}" stroke="${theme.stroke}"/>
    <rect x="82" y="92" width="74" height="18" rx="6" fill="${theme.panelAlt}" stroke="${theme.stroke}"/>
    <rect x="164" y="92" width="74" height="18" rx="6" fill="${theme.panelAlt}" stroke="${theme.stroke}"/>
    ${line(92, 68, 42, theme.muted, 4, 2)}${line(92, 98, 32, theme.muted, 4, 2)}${line(174, 98, 32, theme.muted, 4, 2)}
  `)
}

function group(theme: SvgTheme) {
  return shell(theme, 'Group', `
    <rect x="56" y="54" width="208" height="70" rx="12" fill="${theme.panel}" stroke="${theme.strokeStrong}"/>
    <rect x="72" y="42" width="74" height="24" rx="12" fill="${theme.primary}"/>
    <rect x="78" y="78" width="48" height="26" rx="6" fill="${theme.panelAlt}" stroke="${theme.stroke}"/>
    <rect x="136" y="78" width="48" height="26" rx="6" fill="${theme.panelAlt}" stroke="${theme.stroke}"/>
    <rect x="194" y="78" width="48" height="26" rx="6" fill="${theme.panelAlt}" stroke="${theme.stroke}"/>
  `)
}

function dependency(theme: SvgTheme) {
  return shell(theme, 'Dependency', `
    ${dot(160, 88, theme.primary, 18)}${dot(92, 62, theme.cyan, 14)}${dot(226, 62, theme.purple, 14)}${dot(106, 126, theme.warning, 14)}${dot(220, 126, theme.success, 14)}
    <path d="M145 80L105 68M175 80L214 68M145 100L118 118M176 100L208 118" stroke="${theme.strokeStrong}" stroke-width="4" stroke-linecap="round"/>
    <text x="154" y="94" fill="#fff" font-family="Inter, Arial" font-size="16" font-weight="700">D</text>
  `)
}

function schemaForm(theme: SvgTheme) {
  return shell(theme, 'SchemaForm', `
    <rect x="54" y="46" width="100" height="88" rx="10" fill="${theme.panelAlt}" stroke="${theme.stroke}"/>
    <rect x="168" y="46" width="98" height="88" rx="10" fill="${theme.panel}" stroke="${theme.strokeStrong}"/>
    <path d="M74 66H132M74 84H116M74 102H128M74 120H108" stroke="${theme.muted}" stroke-width="5" stroke-linecap="round"/>
    <path d="M188 66H238M188 92H238M188 118H222" stroke="${theme.stroke}" stroke-width="10" stroke-linecap="round"/>
    <path d="M145 90H172" stroke="${theme.primary}" stroke-width="5" stroke-linecap="round" marker-end="url(#arrow)"/>
    <defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0L8 4L0 8Z" fill="${theme.primary}"/></marker></defs>
  `)
}

function queryFilter(theme: SvgTheme) {
  return shell(theme, 'QueryFilter', `
    <rect x="58" y="58" width="204" height="64" rx="12" fill="${theme.panel}" stroke="${theme.strokeStrong}"/>
    <rect x="76" y="76" width="54" height="18" rx="6" fill="${theme.panelAlt}" stroke="${theme.stroke}"/>
    <rect x="140" y="76" width="54" height="18" rx="6" fill="${theme.panelAlt}" stroke="${theme.stroke}"/>
    <rect x="204" y="76" width="38" height="18" rx="9" fill="${theme.primary}"/>
    <path d="M90 104H208" stroke="${theme.muted}" stroke-width="5" stroke-linecap="round" stroke-dasharray="18 12"/>
  `)
}

function stepsForm(theme: SvgTheme) {
  return shell(theme, 'StepsForm', `
    <path d="M88 62H160H232" stroke="${theme.strokeStrong}" stroke-width="4" stroke-linecap="round"/>
    ${dot(88, 62, theme.primary, 12)}${dot(160, 62, theme.primary, 12)}${dot(232, 62, theme.strokeStrong, 12)}
    <rect x="74" y="88" width="172" height="42" rx="10" fill="${theme.panel}" stroke="${theme.stroke}"/>
    ${line(92, 104, 92, theme.muted, 5, 3)}<rect x="92" y="116" width="54" height="8" rx="4" fill="${theme.primarySoft}"/>
  `)
}

function modalForm(theme: SvgTheme) {
  return shell(theme, 'ModalForm', `
    <rect x="44" y="36" width="232" height="108" rx="12" fill="${theme.panelAlt}" opacity="0.85"/>
    <rect x="82" y="50" width="156" height="88" rx="12" fill="${theme.panel}" stroke="${theme.strokeStrong}" filter="url(#softShadow)"/>
    ${line(100, 68, 70, theme.text, 7, 4)}
    <rect x="100" y="90" width="118" height="16" rx="5" fill="${theme.panelAlt}" stroke="${theme.stroke}"/>
    <rect x="160" y="116" width="58" height="16" rx="8" fill="${theme.primary}"/>
  `)
}

function loginForm(theme: SvgTheme) {
  return shell(theme, 'LoginForm', `
    <rect x="88" y="38" width="144" height="104" rx="14" fill="${theme.panel}" stroke="${theme.strokeStrong}" filter="url(#softShadow)"/>
    <circle cx="160" cy="66" r="16" fill="${theme.primarySoft}" stroke="${theme.primary}"/>
    <path d="M148 98H212M148 120H212" stroke="${theme.stroke}" stroke-width="12" stroke-linecap="round"/>
    <circle cx="124" cy="98" r="6" fill="${theme.primary}"/><circle cx="124" cy="120" r="6" fill="${theme.muted}"/>
  `)
}

function table(theme: SvgTheme) {
  return shell(theme, 'Table', `
    <rect x="56" y="48" width="208" height="84" rx="10" fill="${theme.panel}" stroke="${theme.strokeStrong}"/>
    <rect x="56" y="48" width="208" height="24" rx="10" fill="${theme.primarySoft}"/>
    <path d="M56 72H264M56 94H264M56 116H264M112 48V132M168 48V132M224 48V132" stroke="${theme.stroke}" stroke-width="2"/>
    ${line(72, 57, 24, theme.primary, 5, 3)}${line(128, 57, 24, theme.primary, 5, 3)}${line(184, 57, 24, theme.primary, 5, 3)}
  `)
}

function editableTable(theme: SvgTheme) {
  return shell(theme, 'EditableTable', `
    <rect x="54" y="48" width="212" height="84" rx="10" fill="${theme.panel}" stroke="${theme.strokeStrong}"/>
    <path d="M54 74H266M54 100H266M110 48V132M176 48V132" stroke="${theme.stroke}" stroke-width="2"/>
    <rect x="186" y="82" width="48" height="14" rx="4" fill="${theme.primarySoft}" stroke="${theme.primary}"/>
    <path d="M226 114L238 102L246 110L234 122H226V114Z" fill="${theme.warning}"/>
    ${line(70, 60, 26, theme.muted, 5, 3)}${line(124, 86, 36, theme.muted, 5, 3)}
  `)
}

function dragSortTable(theme: SvgTheme) {
  return shell(theme, 'DragSortTable', `
    <rect x="62" y="44" width="196" height="92" rx="10" fill="${theme.panel}" stroke="${theme.strokeStrong}"/>
    ${[60, 84, 108].map((y, i) => `<rect x="78" y="${y}" width="164" height="16" rx="5" fill="${i === 1 ? theme.primarySoft : theme.panelAlt}" stroke="${i === 1 ? theme.primary : theme.stroke}"/>${dot(90, y + 8, i === 1 ? theme.primary : theme.muted, 3)}${dot(98, y + 8, i === 1 ? theme.primary : theme.muted, 3)}${line(112, y + 5, 76, theme.muted, 4, 2)}`).join('')}
    <path d="M228 80L238 90L228 100" stroke="${theme.primary}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
  `)
}

function listy(theme: SvgTheme) {
  return shell(theme, 'Listy', `
    <rect x="64" y="42" width="192" height="96" rx="12" fill="${theme.panel}" stroke="${theme.strokeStrong}"/>
    ${[58, 84, 110].map((y, i) => `${dot(84, y + 8, [theme.primary, theme.success, theme.purple][i], 7)}${line(104, y + 2, 76, theme.text, 5, 3)}${line(104, y + 14, 116, theme.muted, 4, 2)}<path d="M232 ${y + 6}L238 ${y + 12}L232 ${y + 18}" stroke="${theme.strokeStrong}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>`).join('')}
  `)
}

function field(theme: SvgTheme) {
  return shell(theme, 'Field', `
    <rect x="66" y="50" width="188" height="80" rx="12" fill="${theme.panel}" stroke="${theme.strokeStrong}"/>
    <rect x="88" y="66" width="60" height="22" rx="11" fill="${theme.primarySoft}" stroke="${theme.primary}"/>
    <rect x="160" y="66" width="72" height="22" rx="11" fill="${theme.panelAlt}" stroke="${theme.stroke}"/>
    <rect x="88" y="104" width="144" height="12" rx="6" fill="${theme.panelAlt}" stroke="${theme.stroke}"/>
    <circle cx="102" cy="77" r="5" fill="${theme.primary}"/><path d="M176 77H216" stroke="${theme.muted}" stroke-width="5" stroke-linecap="round"/>
  `)
}

function skeleton(theme: SvgTheme) {
  return shell(theme, 'Skeleton', `
    <circle cx="90" cy="70" r="18" fill="${theme.panelAlt}"/>
    ${line(124, 58, 104, theme.panelAlt, 10, 5)}${line(124, 80, 78, theme.panelAlt, 8, 4)}
    <rect x="72" y="112" width="176" height="14" rx="7" fill="${theme.panelAlt}"/>
    <rect x="72" y="136" width="126" height="10" rx="5" fill="${theme.panelAlt}"/>
  `)
}

function fallback(theme: SvgTheme, name: string) {
  return shell(theme, name, `
    <rect x="72" y="48" width="176" height="84" rx="14" fill="${theme.panel}" stroke="${theme.strokeStrong}"/>
    <rect x="94" y="70" width="46" height="38" rx="8" fill="${theme.primarySoft}"/>
    <rect x="154" y="70" width="72" height="10" rx="5" fill="${theme.text}"/>
    <rect x="154" y="94" width="56" height="8" rx="4" fill="${theme.muted}"/>
    <text x="160" y="126" text-anchor="middle" fill="${theme.primary}" font-family="Inter, Arial" font-size="13" font-weight="700">${escapeXml(name)}</text>
  `)
}

const renderers: Record<string, (theme: SvgTheme) => string> = {
  Layout: layout,
  PageContainer: pageContainer,
  Card: card,
  StatisticCard: statisticCard,
  CheckCard: checkCard,
  Form: form,
  FieldSet: fieldSet,
  Group: group,
  Dependency: dependency,
  SchemaForm: schemaForm,
  QueryFilter: queryFilter,
  StepsForm: stepsForm,
  ModalForm: modalForm,
  LoginForm: loginForm,
  Table: table,
  EditableTable: editableTable,
  DragSortTable: dragSortTable,
  Listy: listy,
  Field: field,
  Skeleton: skeleton,
}

const componentNames = Object.keys(renderers)

function createCover(name: string, themeName: ThemeName) {
  const theme = themes[themeName]
  const renderer = renderers[name] || ((currentTheme: SvgTheme) => fallback(currentTheme, name))
  return svgToDataUri(renderer(theme))
}

export const covers: Covers = Object.fromEntries(
  componentNames.map(name => [
    name,
    {
      cover: createCover(name, 'light'),
      coverDark: createCover(name, 'dark'),
    },
  ]),
)

export function getComponentCover(name: string, dark = false) {
  const cover = covers[name]
  if (cover)
    return dark ? cover.coverDark : cover.cover

  return createCover(name, dark ? 'dark' : 'light')
}
