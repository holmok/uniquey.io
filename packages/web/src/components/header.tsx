import type { NextComponentType } from 'next'
import { useState } from 'react'
import Link from 'next/link'
import { Constants } from '@uniquey.io/common'

const PageHeader: NextComponentType = () => {
  const [menuVisible, setMenuVisible] = useState(false)
  return (
    <header>
      <section className='container' id='header'>
        <div className='lcr-container'>
          <div><span className='text'>{Constants.name}</span></div>
          <div><span className='text'><Link href='#'><a onClick={() => setMenuVisible(!menuVisible)} id='menu'>menu <span className='hamburger'>☰</span></a></Link></span></div>
        </div>
      </section>
      <section className='container' id='menu-container' style={menuVisible ? { display: 'block' } : { display: 'none' }}>
        <div id='navigation'>
          <ul>
            <li><Link href='/'><a onClick={() => setMenuVisible(false)}>Home</a></Link></li>
            <li><Link href='/service-check'><a onClick={() => setMenuVisible(false)}>Service Check</a></Link></li>
          </ul>
        </div>
      </section>
    </header>
  )
}

export default PageHeader
