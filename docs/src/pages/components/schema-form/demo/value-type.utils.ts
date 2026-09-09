function isPlainObject(value: object) {
  const prototype = Object.getPrototypeOf(value)
  return prototype === Object.prototype || prototype === null
}

export function cloneValueTypeInitialValue<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map(item => cloneValueTypeInitialValue(item)) as T
  }
  if (value && typeof value === 'object' && isPlainObject(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        cloneValueTypeInitialValue(item),
      ]),
    ) as T
  }
  return value
}
