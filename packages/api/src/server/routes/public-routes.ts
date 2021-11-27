import KoaRouter from '@koa/router'
import { UniqueyRandomErrorResponse, UniqueyRandomGoodResponse } from '@uniquey.io/common'
import { ServerContext } from '../server'
import { UniqueyRandomServiceRequest } from '../services/uniquey-services'
import RequestIp from 'request-ip'
import LRU from 'lru-cache'

const cache = new LRU<string, number>({ maxAge: 1000 * 60 })

const publicRouter = new KoaRouter()

export default publicRouter
  .get('/ok', getCheck)
  .get('/random', getRandom)
  .get('/token', getToken)

function validateQueryNumber (req: string|string[]|undefined, defaultValue: number): number {
  if (req === undefined) {
    return defaultValue
  }
  if (typeof req === 'string') {
    return parseInt(req, 10)
  }
  if (Array.isArray(req)) {
    throw new Error('Invalid query string')
  }
  return defaultValue
}
function validateQueryString (req: string|string[]|undefined, defaultValue: string): string {
  if (req === undefined) {
    return defaultValue
  }
  if (typeof req === 'string') {
    return req
  }
  if (Array.isArray(req)) {
    throw new Error('Invalid query string')
  }
  return defaultValue
}

async function getToken (ctx: ServerContext): Promise<void> {
  const ip = RequestIp.getClientIp(ctx.request)
  if (ip == null) ctx.throw(400)
  const tokenService = ctx.state.services.token
  try {
    ctx.body = { token: tokenService.getToken(ip) }
  } catch (err: any) {
    ctx.log.error(err)
    ctx.throw(
      err.message === 'IP already has token.' ? 429 : 500,
      err.message === 'IP already has token.' ? 'IP already has token and is not expired.' : err.message
    )
  }
}

async function getCheck (ctx: ServerContext): Promise<void> {
  const systemService = ctx.state.services.system
  ctx.body = systemService.check(ctx)
}

async function getRandom (ctx: ServerContext): Promise<void> {
  const uniqueyService = ctx.state.services.uniquey
  const tokenService = ctx.state.services.token

  const { jwt } = ctx.request.headers
  const ip = RequestIp.getClientIp(ctx.request)

  if (jwt == null || ip == null) ctx.throw(401)
  let id = null
  try {
    id = tokenService.validateToken(ip, jwt as string)
  } catch (err: any) {
    ctx.throw(401)
  }

  const requests = (cache.get(id) ?? 0) + 1
  if (requests > 60) ctx.throw(429)
  cache.set(id, requests)

  const request: UniqueyRandomServiceRequest = {
    count: validateQueryNumber(ctx.query.count, 1),
    length: validateQueryNumber(ctx.query.length, 8),
    characters: validateQueryString(ctx.query.characters, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'),
    allocate: validateQueryNumber(ctx.query.count, 1) * validateQueryNumber(ctx.query.length, 8),
    multiByteCharacters: true
  }
  const response = uniqueyService.createRandomStrings(request)
  const error: boolean = response.isError
  if (error) {
    const error = response as UniqueyRandomErrorResponse
    ctx.throw(error.error, 400)
  } else {
    const output = response as UniqueyRandomGoodResponse
    ctx.body = { ...output, isError: false }
  }
}
