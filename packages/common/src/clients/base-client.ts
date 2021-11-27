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
    return exp == null || exp < now
  };

  private async getToken (): Promise<string | null> {
    if (typeof window === 'undefined' || window.localStorage == null) {
      return null
    }
    try {
      const token = window.localStorage.getItem('jwt')
      if (token != null && !this.tokenExpired(token)) return token
      else {
        const response = await this.axios.request<{token: string}>({ url: '/token', method: 'GET' })
        const jwt = response.data.token
        if (jwt != null) { window.localStorage.setItem('jwt', jwt) }
        return jwt
      }
    } catch (err) {
      return null
    }
  }

  abstract get names (): {[key: string]: string}
  protected async request<T >(url: string, data?: any, params?: any, method: Method = 'GET'): Promise<ClientResponse<T | {error: string}>> {
    let response
    try {
      const jwt = await this.getToken()
      if (jwt == null) {
        return {
          data: { error: 'Token issue, your browser my not support this website.  Or a token was already given to this IP for a different client.  Please wait a minute and try again.' },
          status: 401,
          statusText: 'unauthorize'
        }
      }
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
