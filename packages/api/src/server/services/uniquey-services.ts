import Pino from 'pino'
import Uniquey, { UniqueyOptions } from 'uniquey'
import { UniqueyRandomResponse } from '@uniquey.io/common'

export type UniqueyRandomServiceRequest = UniqueyOptions & {count: number}

class UniqueyServices {
  constructor (private readonly logger: Pino.Logger) {
    this.logger.info('UniqueyServices loaded')
  }

  createRandomStrings (request: UniqueyRandomServiceRequest): UniqueyRandomResponse {
    const uniquey = new Uniquey(request)
    const output: UniqueyRandomResponse = []
    for (let i = 0; i < request.count; i++) {
      output.push(uniquey.create())
    }
    return output
  }
}

export default UniqueyServices
