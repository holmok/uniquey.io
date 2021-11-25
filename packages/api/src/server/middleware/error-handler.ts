import { Middleware, Next } from 'koa'
import { ServerContextState, ServerContext } from '../server'

export default function ErrorHandler (): Middleware<ServerContextState, ServerContext> {
  return async (ctx: ServerContext, next: Next) => {
    try {
      await next() // handle page not founds
      const status = ctx.status ?? 404
      if (status === 404) {
        ctx.throw(404, `page not found: ${ctx.request.url}`)
      }
    } catch (error: any) {
      ctx.log.error(error.stack)
      ctx.status = error.statusCode ?? error.status ?? 500 // default 500 to unhandled server error?
      if (ctx.status === 401) {
        ctx.throw(401, 'unauthorized')
      } else {
        ctx.body = {
          error: error.message,
          status: ctx.status,
          stack: ctx.state.dev ? error.stack : undefined
        }
      }
    }
  }
}
