import PageHeader from './header'
import PageFooter from './footer'
import { FunctionComponent, ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

const Layout: FunctionComponent<LayoutProps> = ({ children }) => {
  return (
    <>
      <main className='wrapper'>
        <PageHeader />
        <section className='container' id='body'>
          {children}
          <div className='info'>
            <p>
              <strong>▸ Source for site:</strong> <a href='https://github.com/holmok/uniquey.io' target='_blank' rel='noreferrer'>https://github.com/holmok/uniquey.io</a>
            </p>
            <p>
              <strong>▸ Source for node.js module used to make random unqiuey strings: </strong><a href='https://www.npmjs.com/package/uniquey' target='_blank' rel='noreferrer'>https://www.npmjs.com/package/uniquey</a>
            </p>
          </div>
        </section>
        <PageFooter />
      </main>
    </>
  )
}

export default Layout
