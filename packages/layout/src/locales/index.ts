import { findIntlKeyByAntdLocaleKey } from '@antdv-next1/pro-provider'
import { isBrowser } from '@antdv-next1/pro-utils'
import { useConfig } from 'antdv-next/dist/config-provider/index'
import arEgLocal from './ar-EG'
import caEsLocal from './ca-ES'
import csCzLocal from './cs-CZ'
import deDeLocal from './de-DE'
import enGbLocal from './en-GB'
import enUsLocal from './en-US'
import esEsLocal from './es-ES'
import faIrLocal from './fa-IR'
import frFrLocal from './fr-FR'
import heIlLocal from './he-IL'
import hrHrLocal from './hr-HR'
import idIdLocal from './id-ID'
import itItLocal from './it-IT'
import jaJpLocal from './ja-JP'
import koKrLocal from './ko-KR'
import mnMnLocal from './mn-MN'
import msMyLocal from './ms-MY'
import nlNlLocal from './nl-NL'
import plPlLocal from './pl-PL'
import ptBrLocal from './pt-BR'
import roRoLocal from './ro-RO'
import ruRuLocal from './ru-RU'
import skSkLocal from './sk-SK'
import srRsLocal from './sr-RS'
import svSeLocal from './sv-SE'
import thThLocal from './th-TH'
import trTrLocal from './tr-TR'
import ukUaLocal from './uk-UA'
import uzUzLocal from './uz-UZ'
import viVnLocal from './vi-VN'
import zhCnLocal from './zh-CN'
import zhHkLocal from './zh-HK'
import zhTwLocal from './zh-TW'

export const locales = {
  'ar-EG': arEgLocal,
  'ca-ES': caEsLocal,
  'cs-CZ': csCzLocal,
  'de-DE': deDeLocal,
  'en-GB': enGbLocal,
  'en-US': enUsLocal,
  'es-ES': esEsLocal,
  'fa-IR': faIrLocal,
  'fr-FR': frFrLocal,
  'he-IL': heIlLocal,
  'hr-HR': hrHrLocal,
  'id-ID': idIdLocal,
  'it-IT': itItLocal,
  'ja-JP': jaJpLocal,
  'ko-KR': koKrLocal,
  'mn-MN': mnMnLocal,
  'ms-MY': msMyLocal,
  'nl-NL': nlNlLocal,
  'pl-PL': plPlLocal,
  'pt-BR': ptBrLocal,
  'ro-RO': roRoLocal,
  'ru-RU': ruRuLocal,
  'sk-SK': skSkLocal,
  'sr-RS': srRsLocal,
  'sv-SE': svSeLocal,
  'th-TH': thThLocal,
  'tr-TR': trTrLocal,
  'uk-UA': ukUaLocal,
  'uz-UZ': uzUzLocal,
  'vi-VN': viVnLocal,
  'zh-CN': zhCnLocal,
  'zh-HK': zhHkLocal,
  'zh-TW': zhTwLocal,
}
interface GLocaleWindow {
  g_locale: keyof typeof locales
}

export function getLanguage(): string {
  const config = useConfig()
  if (config.value.locale?.locale) {
    return findIntlKeyByAntdLocaleKey(config.value.locale?.locale)
  }
  // support ssr
  if (!isBrowser())
    return 'zh-CN'
  return (window as unknown as GLocaleWindow).g_locale || navigator.language
}
export function gLocaleObject(): Record<string, string> {
  const gLocale = getLanguage()
  return locales[gLocale as keyof typeof locales] || locales['zh-CN']
}
