import KoaRouter from '@koa/router'
import { UniqueyRandomErrorResponse, UniqueyRandomGoodResponse } from '@uniquey.io/common'
import { ServerContext } from '../server'
import { UniqueyRandomServiceRequest } from '../services/uniquey-services'

const publicRouter = new KoaRouter()

export default publicRouter
  .get('/ok', getCheck)
  .get('/random', getRandom)

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

async function getCheck (ctx: ServerContext): Promise<void> {
  const systemService = ctx.state.services.system
  ctx.body = systemService.check(ctx)
}

async function getRandom (ctx: ServerContext): Promise<void> {
  const uniqueyService = ctx.state.services.uniquey
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
