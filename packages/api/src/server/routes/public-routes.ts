import KoaRouter from '@koa/router'
import { ServerContext } from '../server'

const publicRouter = new KoaRouter()

export default publicRouter
  .get('/ok', getCheck)

async function getCheck (ctx: ServerContext): Promise<void> {
  const systemService = ctx.state.services.system
  ctx.body = systemService.check(ctx)
}
