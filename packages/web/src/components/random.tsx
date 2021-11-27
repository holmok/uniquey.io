import { ReactElement } from 'react'
import { getClients } from 'src/pages/_app'
import { UniqueyRandomErrorResponse, UniqueyRandomGoodResponse } from '@uniquey.io/common'
import SWR from 'swr'
import UniqueyClient from '@uniquey.io/common/dist/clients/uniquey-client'

export interface RandomPartsProps {
  num: number
  count: number
  length: number
  characters: string
}

export default function RandomParts (props: RandomPartsProps): ReactElement {
  const uniquey: UniqueyClient = getClients().uniquey()
  const { data, error } = SWR(`${uniquey.names.random}_${props.num}`, async () => await uniquey.random({
    characters: props.characters,
    length: props.length,
    count: props.count
  }))
  if (data == null) {
    return (<></>)
  } else
  if (error != null) {
    return (<div className='errors'>{error.message}</div>)
  } else if (data?.status !== 200) {
    const response = data.data as UniqueyRandomErrorResponse
    return (<div className='errors'>{response.error}</div>)
  } else {
    const response = data.data as UniqueyRandomGoodResponse
    return (<pre>{response.random.join('\n')}</pre>)
  }
}
