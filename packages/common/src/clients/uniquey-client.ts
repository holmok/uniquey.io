import { ClientResponse, UniqueyRandomRequest, UniqueyRandomResponse } from '../types'
import BaseClient from './base-client'

export default class UniqueyClient extends BaseClient {
  get names (): {[key: string]: string} {
    return {
      random: 'UniqueyClient.random'
    }
  }

  async random (options: UniqueyRandomRequest): Promise<ClientResponse<UniqueyRandomResponse>> {
    let url = `/random?length=${encodeURIComponent(options.length ?? 8)}&count=${encodeURIComponent(options.count ?? 1)}`
    if (options.characters != null) {
      url += `&characters=${encodeURIComponent(options.characters)}`
    }
    return await this.request<UniqueyRandomResponse>(url)
  }
}
