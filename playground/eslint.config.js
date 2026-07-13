import { sxzz } from '@sxzz/eslint-config'

export default [...(await sxzz()), { rules: { 'baseline-js/use-baseline': 'off' } }]
