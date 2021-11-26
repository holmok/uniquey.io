import { AxiosInstance, Method } from 'axios'
import { ClientResponse } from 'src/types'

abstract class BaseClient {
  constructor (protected readonly axios: AxiosInstance) {
  }

  abstract get names (): {[key: string]: string}
  protected async request<T>(url: string, data?: any, params?: any, method: Method = 'GET'): Promise<ClientResponse<T>> {
    let response
    try {
      response = await this.axios.request<T>({ url, data, params, method })
      return {
        data: response.data,
        status: response.status,
        statusText: response.statusText
      }
    } catch (err: any) {
      return {
        data: err.response.data,
        status: err.response.status,
        statusText: err.response.statusText
      }
    }
  }
}

export default BaseClient
