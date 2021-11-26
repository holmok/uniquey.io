import Pino from 'pino'
import Uniquey, { UniqueyOptions } from 'uniquey'
import { UniqueyRandomGoodResponse, UniqueyRandomResponse } from '@uniquey.io/common'

export type UniqueyRandomServiceRequest = UniqueyOptions & {count: number}

class UniqueyServices {
  constructor (private readonly logger: Pino.Logger) {
    this.logger.info('UniqueyServices loaded')
  }

  createRandomStrings (request: UniqueyRandomServiceRequest): UniqueyRandomResponse {
    try {
      const uniquey = new Uniquey(request)
      const output: UniqueyRandomGoodResponse = { random: [] }
      for (let i = 0; i < request.count; i++) {
        output.random.push(uniquey.create())
      }
      return { ...output, isError: false }
    } catch (err: any) {
      return { message: err.message, isError: true }
    }
  }
}

export default UniqueyServices
