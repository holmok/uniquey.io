import type { NextComponentType } from 'next'
import Link from 'next/link'
import { Constants } from '@uniquey.io/common'
const PageFooter: NextComponentType = () => {
  return (

    <footer>
      <section className='container' id='footer'>
        <div className='lcr-container'>
          <div><span className='text'><Link href='/'><a>Home</a></Link></span></div>
          <div><span className='text'>{Constants.copyright}</span></div>
          <div><span className='text'><Link href='#top'><a>^ back to top</a></Link></span></div>
        </div>
      </section>
    </footer>

  )
}

export default PageFooter
