
function isMultiByte (characters: string): boolean {
  return /[\uD800-\uDFFF]/.test(characters)
}
function splitMultiByte (characters: string): string[] {
  // first split with multi-byte characters
  const splitMulti = characters.split(/([\uD800-\uDBFF][\uDC00-\uDFFF])/).filter((i) => (i != null) && (i.length > 1))
  const output: string[] = []
  // split the other chunks
  splitMulti.forEach((i) => {
    if (isMultiByte(i)) {
      output.push(i)
    } else {
      output.push(...i.split(''))
    }
  })
  return output
}

export function validateCharactersLength (chars: string): boolean {
  const split = splitMultiByte(chars)
  return split.length <= 256
}

export function validateCharactersUnique (chars: string): boolean {
  const split = splitMultiByte(chars)
  const set = new Set(split)
  return split.length !== set.size
}

export function getLocalStorage (key: string, defaultValue: string): string {
  if (typeof window === 'undefined' || window.localStorage == null) return defaultValue
  return window.localStorage.getItem(key) ?? defaultValue
}

export function setLocalStorage (key: string, value: string): void {
  if (typeof window === 'undefined' || window.localStorage == null) return
  window.localStorage.setItem(key, value)
}
