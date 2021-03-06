import { ChangeEvent, ReactElement, useState } from 'react'
import Head from 'next/head'
import Layout from '../components/layout'
import RandomParts from '../components/random'
import Sources from '../components/sources'
import { Constants } from '@uniquey.io/common'
import * as Utils from 'src/utils'

const CHARACTER_SETS: {[key: string]: {key: string, label: string, characters: string}} = {
  base62: { key: 'base62', label: 'Base62', characters: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ' },
  base36: { key: 'base36', label: 'Base36', characters: '0123456789abcdefghijklmnopqrstuvwxyz' },
  base52: { key: 'base52', label: 'Letters(upper/lower)', characters: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ' },
  base26upper: { key: 'base26upper', label: 'Letters(upper)', characters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' },
  base26lower: { key: 'base26lower', label: 'Letters(lower)', characters: 'abcdefghijklmnopqrstuvwxyz' },
  hex: { key: 'hex', label: 'Hex', characters: '0123456789abcdef' },
  emoji: { key: 'emoji', label: 'Emojis', characters: '๐๐๐๐คฃ๐๐๐๐๐๐๐๐๐๐๐๐๐๐๐ค๐คฉ๐ค๐คจ๐๐๐ถ๐๐๐ฃ๐ฅ๐ฎ๐ค๐ฏ๐ช๐ซ๐ด๐๐๐๐๐คค๐๐๐๐๐๐ค๐ฒ๐๐๐๐๐ค๐ข๐ญ๐ฆ๐ง๐จ๐ฉ๐คฏ๐ฌ๐ฐ๐ฑ๐ณ๐คช๐ต๐ก๐ ๐คฌ๐ท๐ค๐ค๐คข๐คฎ๐คง๐๐ค ๐คก๐คฅ๐คซ๐คญ๐ง๐ค๐๐ฟ๐น๐บ๐๐ป๐ฝ๐ค๐ฉ๐บ๐ธ๐น๐ป๐ผ๐ฝ๐๐ฟ๐พ๐ถ๐ฆ๐ง๐จ๐ฉ๐ด๐ต' },
  animals: { key: 'animals', label: 'Animals', characters: '๐ต๐๐ฆ๐ถ๐๐ฉ๐บ๐ฆ๐ฑ๐๐ฆ๐ฏ๐๐๐ด๐๐ฆ๐ฆ๐ฎ๐๐๐๐ท๐๐๐ฝ๐๐๐๐ช๐ซ๐ฆ๐๐ฆ๐ญ๐๐๐น๐ฐ๐๐ฟ๐ฆ๐ฆ๐ป๐จ๐ผ๐พ๐ฆ๐๐๐ฃ๐ค๐ฅ๐ฆ๐ง๐๐ฆ๐ฆ๐ฆ๐ธ๐๐ข๐ฆ๐๐ฒ๐๐ฆ๐ฆ๐ณ๐๐ฌ๐๐ ๐ก๐ฆ๐๐๐ฆ๐ฆ๐ฆ๐๐ฆ๐๐๐๐๐ฆ๐ท๐ธ๐ฆ' }
}

export default function Page (): ReactElement {
  // set up state and hooks
  const defaultCharacters = Utils.getLocalStorage('characters', CHARACTER_SETS.base62.characters)
  const [characters, setCharacters] = useState<string>(defaultCharacters)

  const defaultCharacterSet = JSON.parse(Utils.getLocalStorage('characterSet', JSON.stringify(CHARACTER_SETS.base62)))
  const [characterSet, setCharacterSet] = useState<{key: string, label: string, characters: string}>(defaultCharacterSet)

  const defaultLength = parseInt(Utils.getLocalStorage('length', '32'), 10)
  const [length, setLength] = useState<number|undefined>(defaultLength)

  const defaultCount = parseInt(Utils.getLocalStorage('count', '8'), 10)
  const [count, setCount] = useState<number|undefined>(defaultCount)

  const [errors, setErrors] = useState<string[]>([])

  const [showRandom, setShowRandom] = useState<number>(0)

  // event handlers
  async function handleCreateRandom (): Promise<void> {
    if (errors.length === 0) {
      setShowRandom(Date.now())
    }
  }

  function handleCountChange (e: ChangeEvent<HTMLInputElement>): void {
    const value = parseInt(e.target.value)
    const actualErrors = errors.filter((error: string) => !error.startsWith('Count '))
    if (isNaN(value)) {
      actualErrors.push('Count must be a number')
    } else if (value < 1 || value > 1024) {
      actualErrors.push(`Count must be between 1 and 1024 (you got ${value.toLocaleString()})`)
    }
    setErrors(actualErrors)
    if (!isNaN(value)) {
      Utils.setLocalStorage('count', e.target.value)
      setCount(value)
    } else setCount(undefined)
  }

  function handleLengthChange (e: ChangeEvent<HTMLInputElement>): void {
    const value = parseInt(e.target.value)
    const actualErrors = errors.filter((error: string) => !error.startsWith('Length '))
    if (isNaN(value)) {
      actualErrors.push('Length must be a number')
    } else if (value < 1 || value > 1024) {
      actualErrors.push(`Length must be between 1 and 1024 (you got ${value.toLocaleString()})`)
    }
    setErrors(actualErrors)
    if (!isNaN(value)) {
      Utils.setLocalStorage('length', e.target.value)
      setLength(value)
    } else setLength(undefined)
  }

  function handleCharacterSetChange (e: ChangeEvent<HTMLSelectElement>): void {
    const actualErrors = errors.filter((error: string) => !error.startsWith('Characters '))
    setErrors(actualErrors)
    setCharacterSet(CHARACTER_SETS[e.target.value])
    setCharacters(CHARACTER_SETS[e.target.value].characters)
    Utils.setLocalStorage('characterSet', JSON.stringify(CHARACTER_SETS[e.target.value]))
    Utils.setLocalStorage('characters', CHARACTER_SETS[e.target.value].characters)
  }

  function handleCharactersChange (e: ChangeEvent<HTMLInputElement>): void {
    const actualErrors = errors.filter((error: string) => !error.startsWith('Characters '))
    const newCharacters = (e.target as HTMLInputElement).value
    if (newCharacters.length === 0) {
      actualErrors.push('Characters cannot be empty')
    } else if (Utils.validateCharactersLength(newCharacters) === false) {
      actualErrors.push(`Characters must be less than 256 character (you got ${newCharacters.length.toLocaleString()}) `)
    } else if (Utils.validateCharactersUnique(newCharacters) !== false) {
      actualErrors.push('Characters must be unique.')
    }
    setErrors(actualErrors)
    Utils.setLocalStorage('characters', e.target.value)
    setCharacters(e.target.value)
  }

  return (
    <>
      <Head>
        <title>{Constants.name} - Home</title>
      </Head>
      <div className='row'>
        <div className='column'><h3>Create a Bunch of Random Strings</h3></div>
      </div>
      <div className='errors' style={errors.length > 0 ? { display: 'block' } : { display: 'none' }}>
        <ul>
          {errors.map((error: string, index: number) => (<li key={index}>{error}</li>))}
        </ul>
      </div>
      <form>
        <fieldset>
          <div className='row'>
            <div className='column'>
              <label htmlFor='characters' className='small'>Characters:</label>
              <input
                id='characters'
                type='text'
                value={characters}
                onChange={handleCharactersChange}
              />
            </div>
            <div className='column'>
              <label htmlFor='characterSets' className='small'>Preset Character Sets (1-256 unique characters):</label>
              <select
                value={characterSet.key}
                id='characterSets'
                onChange={handleCharacterSetChange}
              >
                {Object.values(CHARACTER_SETS).map((characterSet) => (<option key={characterSet.key} value={characterSet.key}>{characterSet.label}</option>))}
              </select>
            </div>
          </div>
          <div className='row'>
            <div className='column'>
              <label htmlFor='length' className='small'>String length (1-1024):</label>
              <input
                id='length'
                type='text'
                value={length}
                onChange={handleLengthChange}
              />
            </div>
            <div className='column'>
              <label htmlFor='count' className='small'>How many strings to create (1-1024):</label>
              <input
                id='count'
                type='text'
                value={count}
                onChange={handleCountChange}
              />
            </div>
          </div>
          <div className='row'>
            <div className='column'>
              <input
                className='button-primary'
                disabled={errors.length > 0}
                type='button'
                value='Create Random Strings'
                onClick={handleCreateRandom}
              />
            </div>
          </div>
        </fieldset>
      </form>
      {showRandom > 0 &&
        <RandomParts
          num={showRandom}
          count={count as number}
          length={length as number}
          characters={characters}
        />}
      <Sources />
    </>
  )
}

Page.getLayout = (page: ReactElement) => {
  return (
    <Layout>
      {page}
    </Layout>
  )
}
