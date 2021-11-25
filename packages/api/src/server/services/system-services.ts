import { HeathCheckResponse } from '@uniquey.io/common'
import { ServerContext } from '../server'
import Pino from 'pino'

class SystemServices {
  constructor (private readonly logger: Pino.Logger) {
    this.logger.info('SystemServices loaded')
  }

  check (ctx: ServerContext): HeathCheckResponse {
    this.logger.debug('SystemServices.check()')
    return {
      name: ctx.state.name,
      status: 'ok',
      timestamp: new Date().toISOString(),
      host: ctx.state.host,
      environment: ctx.state.environment
    }
  }
}

export default SystemServices
