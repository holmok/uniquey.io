import { ClientResponse, HeathCheckResponse } from '../types'
import BaseClient from './base-client'

export default class SystemClient extends BaseClient {
  get names (): {[key: string]: string} {
    return {
      healthCheck: 'SystemClient.healthCheck'
    }
  }

  async healthCheck (): Promise<ClientResponse<HeathCheckResponse>> {
    return await this.request<HeathCheckResponse>('/ok')
  }
}
