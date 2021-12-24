import type { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import { InitClients, Clients } from '@uniquey.io/common'
import 'milligram/dist/milligram.min.css'
import '../styles/layout.css'
import '../styles/header.css'
import '../styles/footer.css'

const clients = InitClients('/api')

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export function getClients(): Clients {
  return clients
}

export default function MyApp({ Component, pageProps }: AppPropsWithLayout): ReactNode {
  const getLayout = Component.getLayout ?? ((page) => page)
  return getLayout(<Component {...pageProps} />)
}
