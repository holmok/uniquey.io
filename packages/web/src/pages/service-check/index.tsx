import { ReactElement } from 'react'
import Head from 'next/head'
import Layout from '../../components/layout'
import { getClients } from '../_app'
import SWR from 'swr'
import { Constants } from '@uniquey.io/common'

export default function Page (): ReactElement {
  const system = getClients().system()
  const uniquey = getClients().uniquey()

  const systemResponse = SWR(system.names.healthCheck, async () => await system.healthCheck())
  const uniqueyResponse = SWR(uniquey.names.random, () => uniquey.random({ count: 32, length: 32, characters: 'AaBbCc' }))

  if (systemResponse.error != null) {
    throw systemResponse.error
  }
  if (uniqueyResponse.error != null) {
    throw uniqueyResponse.error
  }
  return (
    <>
      <Head>
        <title>{Constants.name} - Service Check</title>
      </Head>
      <h3>Service Check</h3>
      <pre>{JSON.stringify(systemResponse.data, null, 2)}</pre>
      <h3>Random Stuff</h3>
      <pre>{JSON.stringify(uniqueyResponse.data, null, 2)}</pre>
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
