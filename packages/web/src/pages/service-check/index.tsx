import { ReactElement } from 'react'
import Head from 'next/head'
import Layout from '../../components/layout'
import { getClients } from '../_app'
import SWR from 'swr'
import { Constants } from '@uniquey.io/common'

export default function Page (): ReactElement {
  const system = getClients().system()
  const { data, error } = SWR(system.names.healthCheck, async () => await system.healthCheck())

  if (error != null) {
    throw error
  }
  return (
    <>
      <Head>
        <title>{Constants.name} - Service Check</title>
      </Head>
      <h3>Service Check</h3>
      <pre>{JSON.stringify(data, null, 2)}</pre>
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
