import { ReactElement } from 'react'
import Head from 'next/head'
import Layout from '../../components/layout'
import { Constants } from '@uniquey.io/common'
import Sources from '../../components/sources'

export default function Page(): ReactElement {
  return (
    <>
      <Head>
        <title>{Constants.name} - About</title>
      </Head>
      <h3>About</h3>
      <p>
        Hello!  My name is Chris Holmok.  I make the codes.  I specialize in Node.js and
        other languages (Python, Java, Go, Rust, C#, etc.).  I have been coding for a long
        time (over 40 years). I made this site to support my uniquey node module and because
        random.org is meh.
      </p>
      <p>
        I hope you like it and find it helpful.  It is a proper JAM stack
        (Javascript, API, Markup). It uses <a href='https://nextjs.org/' target='_blank' rel='noreferrer'>Next.js</a> for the frontend,
        and it uses <a href='https://nodejs.org/' target='_blank' rel='noreferrer'>Node.js</a>
        and <a href='https://koajs.com/' target='_blank' rel='noreferrer'>Koa.js</a> for the back-end.
        It is hosted Google Cloud as two containers, one for the Front-End and one for the Back-End. The whole thing is deployed with <a href='https://www.pumlumi.com/' target='_blank' rel='noreferrer'>Pulumi</a>,
        and it is built and deployed with <a href='https://circleci.com/' target='_blank' rel='noreferrer'>CircleCI</a>.
      </p>
      <p>
        Here are some links to other stuff:
      </p>
      <ul>
        <li><a href='https://github.com/holmok' target='_blank' rel='noreferrer'>My Github</a></li>
        <li><a href='https://twitter.com/holmok' target='_blank' rel='noreferrer'>My Twitter</a></li>
        <li><a href='https://www.linkedin.com/in/christopherholmok/' target='_blank' rel='noreferrer'>My LinkedIn</a></li>
        <li><a href='https://holmok.me/' target='_blank' rel='noreferrer'>My Photography</a></li>
      </ul>
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
