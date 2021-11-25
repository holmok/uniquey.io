import Config from 'config'
import Pino from 'pino'
import KoaLogger from 'koa-pino-logger'
import Koa from 'koa'
import KoaCors from '@koa/cors'
import { ServerContextState, ServerContext } from '../server'
import ErrorHandler from './error-handler'
import Routes from '../routes'

export default (config: Config.IConfig, logger: Pino.Logger): Array<Koa.Middleware<ServerContextState, ServerContext>> => {
  logger.info('Initializing middleware')
  return [
    KoaLogger({ logger }), // Logger
    ErrorHandler(), // Error handler
    KoaCors(),
    ...Routes() // Routes
  ]
}
