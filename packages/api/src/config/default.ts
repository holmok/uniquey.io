import Pino from 'pino'
import { Constants } from '@uniquey.io/common'

export interface ServerOptions {
  host: string
  port: number
}

export const name: string = `${Constants.name}/api`

export const environment = 'development'

export const pino: Pino.LoggerOptions = {
  name: `${name}/${environment}`,
  level: process.env.LOG_LEVEL ?? 'debug'
}

export const server: ServerOptions = {
  host: 'localhost',
  port: 8081
}
