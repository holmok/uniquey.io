import Config from 'config'
import Pino from 'pino'
import Koa from 'koa'
import Http from 'http'
import Middleware from './middleware'
import { ServerOptions } from '../config/default'
import Services from './services'
import Cors from '@koa/cors'

export type ServerContextState = Koa.DefaultState & {
  config: Config.IConfig
  logger: Pino.Logger
  name: string
  environment: string
  dev: boolean
  host: string
  services: Services
}

export type ServerContext = Koa.ParameterizedContext<ServerContextState>

export default class Server {
  private readonly app: Koa<ServerContextState, ServerContext>
  server: Http.Server | undefined
  stopping: boolean

  constructor (private readonly config: Config.IConfig, private readonly logger: Pino.Logger) {
    this.logger.info('Server created.')
    this.app = new Koa()
    this.stopping = false
    this.server = undefined
  }

  async start (): Promise<void> {
    const name: string = this.config.get('name')
    this.logger.info('%s server starting.', name)

    const serverOptions: ServerOptions = this.config.get('server')
    const host = `http://${serverOptions.host}:${serverOptions.port.toString()}`

    // set up services
    const services = new Services(this.logger)

    // set up server context/state for request/response
    this.app.use(async (ctx: ServerContext, next) => {
      ctx.state.config = this.config
      ctx.state.name = this.config.get('name')
      ctx.state.environment = this.config.get('environment')
      ctx.state.host = host
      ctx.state.dev = this.config.get('environment') !== 'production'
      ctx.state.services = services
      await next()
    })

    this.app.use(Cors({ allowHeaders: ['jwt'] }))

    // set up middleware (includes routing middleware)
    const middleware = Middleware(this.config, this.logger)
    middleware.forEach(m => this.app.use(m))

    // start server

    this.server = this.app.listen(serverOptions.port, serverOptions.host, () => {
      this.logger.info(
        `${name} server running at ${host}`
      )
    })
  }

  async stop (): Promise<void> {
    this.logger.info('Server stopping.')
    if (!this.stopping) {
      this.stopping = true
      return await new Promise((resolve, reject) => {
        if (this.server == null) {
          reject(new Error('no server to stop.'))
        } else {
          this.server.close((err) => {
            if (err != null) {
              reject(err)
            } else {
              this.logger.info('Server stopped.')
              resolve()
            }
          })
        }
      })
    }
  }
}
