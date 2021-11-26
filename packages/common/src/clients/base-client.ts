import { AxiosInstance, Method } from 'axios'
import { ClientResponse } from 'src/types'

abstract class BaseClient {
  constructor (protected readonly axios: AxiosInstance) {
  }

  private tokenExpired (token: string): boolean {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''))

    const exp: number | undefined = JSON.parse(jsonPayload).exp
    const now = Math.ceil(Date.now() / 1000)
    return exp != null && exp > now
  };

  private async getToken (): Promise<string> {
    if (typeof window === 'undefined' || window.localStorage == null) {
      throw new Error('browser not supported')
    }
    const token = window.localStorage.getItem('jwt')
    if (token != null && !this.tokenExpired(token)) return token
    else {
      const response = await this.axios.request<{jwt: string}>({ url: '/token', method: 'GET' })
      return response.data.jwt
    }
  }

  abstract get names (): {[key: string]: string}
  protected async request<T>(url: string, data?: any, params?: any, method: Method = 'GET'): Promise<ClientResponse<T>> {
    let response
    try {
      const jwt = await this.getToken()
      response = await this.axios.request<T>({ url, data, params, method, headers: { jwt } })
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
