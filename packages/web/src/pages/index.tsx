import { ReactElement, useState } from 'react'
import Head from 'next/head'
import Layout from '../components/layout'
import { Constants } from '@uniquey.io/common'
import { getClients } from './_app'
import SWR from 'swr'

const CHARACTER_SETS = {
  base62: { key: 'base62', label: 'Base62', characters: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ' },
  base36: { key: 'base36', label: 'Base36', characters: '0123456789abcdefghijklmnopqrstuvwxyz' },
  base52: { key: 'base52', label: 'Letters(upper/lower)', characters: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ' },
  base26upper: { key: 'base26upper', label: 'Letters(upper)', characters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' },
  base26lower: { key: 'base26lower', label: 'Letters(lower)', characters: 'abcdefghijklmnopqrstuvwxyz' },
  hex: { key: 'hex', label: 'Hex', characters: '0123456789abcdef' },
  emoji: { key: 'emoji', label: 'Emojis', characters: '😀😁😂🤣😃😄😅😆😉😊😋😎😍😘😗😙😚🙂🤗🤩🤔🤨😐😑😶🙄😏😣😥😮🤐😯😪😫😴😌😛😜😝🤤😒😓😔😕🙃🤑😲🙁😖😞😟😤😢😭😦😧😨😩🤯😬😰😱😳🤪😵😡😠🤬😷🤒🤕🤢🤮🤧😇🤠🤡🤥🤫🤭🧐🤓😈👿👹👺💀👻👽🤖💩😺😸😹😻😼😽🙀😿😾👶👦👧👨👩👴👵' },
  animals: { key: 'animals', label: 'Animals', characters: '🐵🐒🦍🐶🐕🐩🐺🦊🐱🐈🦁🐯🐅🐆🐴🐎🦄🦓🐮🐂🐃🐄🐷🐖🐗🐽🐏🐑🐐🐪🐫🦒🐘🦏🐭🐁🐀🐹🐰🐇🐿🦔🦇🐻🐨🐼🐾🦃🐔🐓🐣🐤🐥🐦🐧🕊🦅🦆🦉🐸🐊🐢🦎🐍🐲🐉🦕🦖🐳🐋🐬🐟🐠🐡🦈🐙🐚🦀🦐🦑🐌🦋🐛🐜🐝🐞🦗🕷🕸🦂' }
}

function RandomParts (props: any): ReactElement {
  const uniquey = getClients().uniquey()
  const { data, error } = SWR(`${uniquey.names.random}_${props.num}`, () => uniquey.random({
    characters: props.characters,
    length: props.length,
    count: props.count
  }))
  if (error != null) { return (<div className='error'>{error.message}</div>) }
  if (data == null) { return (<pre>...loding...</pre>) }
  console.log(data)
  return (<pre>{data.data.join('\n')}</pre>)
}

export default function Page (): ReactElement {
  const [characters, setCharacters] = useState<string>(CHARACTER_SETS.base62.characters)
  const [characterSet, setCharacterSet] = useState<{key: string, label: string, characters: string}>(CHARACTER_SETS.base62)
  const [length, setLength] = useState<number|undefined>(32)
  const [count, setCount] = useState<number|undefined>(5)
  const [errors, setErrors] = useState<string[]>([])
  const [showRandom, setShowRandom] = useState<number>(0)

  function handleCreateRandom (): void {
    setShowRandom(Date.now())
  }
  return (
    <>
      <Head>
        <title>{Constants.name} - Home</title>
      </Head>
      <h3>Create a Bunch of Random Strings</h3>
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
                id='characters' type='text' value={characters} onChange={(e) => {
                  const actualErrors = errors.filter((error: string) => !error.startsWith('Characters '))
                  const newCharacters = (e.target as HTMLInputElement).value
                  if (newCharacters.length === 0) {
                    actualErrors.push('Characters cannot be empty')
                  } else if (newCharacters.length > 256) {
                    actualErrors.push(`Characters must be less than 256 character (you got ${newCharacters.length.toLocaleString()}) `)
                  } else if (newCharacters.length !== (new Set(newCharacters.split(''))).size) {
                    actualErrors.push('Characters must be unique.')
                  }
                  setErrors(actualErrors)
                  setCharacters(e.target.value)
                }}
              />
            </div>
            <div className='column'>
              <label htmlFor='characterSets' className='small'>Preset Character Sets (1-256 unique characters):</label>
              <select
                value={characterSet.key}
                id='characterSets'
                onChange={(e) => {
                  const actualErrors = errors.filter((error: string) => !error.startsWith('Characters '))
                  setErrors(actualErrors)
                  setCharacterSet(CHARACTER_SETS[e.target.value].key)
                  setCharacters(CHARACTER_SETS[e.target.value].characters)
                }}
              >
                {Object.values(CHARACTER_SETS).map((characterSet) => (<option key={characterSet.key} value={characterSet.key}>{characterSet.label}</option>))}
              </select>
            </div>
          </div>
          <div className='row'>
            <div className='column'>
              <label htmlFor='length' className='small'>String length (1-1024):</label>
              <input
                id='length' type='text' value={length} onChange={(e) => {
                  const value = parseInt(e.target.value)
                  const actualErrors = errors.filter((error: string) => !error.startsWith('Length '))
                  if (isNaN(value)) {
                    actualErrors.push('Length must be a number')
                  } else if (value < 1 || value > 1024) {
                    actualErrors.push(`Length must be between 1 and 1024 (you got ${value.toLocaleString()})`)
                  }
                  setErrors(actualErrors)
                  if (!isNaN(value)) setLength(value)
                  else setLength(undefined)
                }}
              />
            </div>
            <div className='column'>
              <label htmlFor='count' className='small'>How many strings to create (1-1024):</label>
              <input
                id='count' type='text' value={count} onChange={(e) => {
                  const value = parseInt(e.target.value)
                  const actualErrors = errors.filter((error: string) => !error.startsWith('Count '))
                  if (isNaN(value)) {
                    actualErrors.push('Count must be a number')
                  } else if (value < 1 || value > 1024) {
                    actualErrors.push(`Count must be between 1 and 1024 (you got ${value.toLocaleString()})`)
                  }
                  setErrors(actualErrors)
                  if (!isNaN(value)) setCount(value)
                  else setCount(undefined)
                }}
              />
            </div>
          </div>
          <div className='row'>
            <div className='column'>
              <input className='button-primary' type='button' value='Create Random Strings' onClick={handleCreateRandom} />
            </div>
          </div>
        </fieldset>
      </form>
      {showRandom > 0 && <RandomParts num={showRandom} count={count} length={length} characters={characters} />}
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
