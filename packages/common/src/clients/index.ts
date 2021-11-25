import Axios from 'axios'
import BaseClient from './base-client'
import SystemClient from './system-client'

export interface Clients {
  [key: string]: () => BaseClient
  system: () => SystemClient
}

export function InitClients (baseURL: string, timeout: number = 5000): { system: () => SystemClient } {
  const axios = Axios.create({
    baseURL,
    timeout
  })

  return {
    system: () => new SystemClient(axios)
  }
}
