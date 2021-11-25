import Koa from 'koa'

import PublicRoutes from './public-routes'
import { ServerContextState, ServerContext } from '../server'
const routes = [
  PublicRoutes.routes(),
  PublicRoutes.allowedMethods()
]

export default (): Array<Koa.Middleware<ServerContextState, ServerContext>> => routes as Array<Koa.Middleware<ServerContextState, ServerContext>>
