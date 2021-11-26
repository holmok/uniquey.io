import Axios from 'axios'
import BaseClient from './base-client'
import SystemClient from './system-client'
import UniqueyClient from './uniquey-client'

export interface Clients {
  [key: string]: () => BaseClient
  system: () => SystemClient
  uniquey: () => UniqueyClient
}

export function InitClients (baseURL: string, timeout: number = 5000): Clients {
  const axios = Axios.create({
    baseURL,
    timeout
  })
  console.log('InitClients', baseURL)
  return {
    system: () => new SystemClient(axios),
    uniquey: () => new UniqueyClient(axios)
  }
}
