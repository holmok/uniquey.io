import Pino from 'pino'
import { ServerOptions } from './default'
import { Constants } from '@uniquey.io/common'

export const environment = 'production'

export const name: string = `${Constants.name}/${environment}/api`

export const pino: Pino.LoggerOptions = {
  name,
  level: process.env.LOG_LEVEL ?? 'info'
}

export const server: ServerOptions = {
  host: '0.0.0.0',
  port: 8081
}
