import PageHeader from './header'
import PageFooter from './footer'
import { FunctionComponent, ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

const Layout: FunctionComponent<LayoutProps> = ({ children }) => {
  return (
    <main className='wrapper'>
      <PageHeader />
      <section className='container' id='body'>
        {children}
      </section>
      <PageFooter />
    </main>
  )
}

export default Layout
