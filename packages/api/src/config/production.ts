import Pino from 'pino'
import { ServerOptions } from './default'

export const name = 'unique/api'

export const environment = 'production'

export const pino: Pino.LoggerOptions = {
  name: `${name}/${environment}`,
  level: process.env.LOG_LEVEL ?? 'info'
}

export const server: ServerOptions = {
  host: '0.0.0.0',
  port: parseInt(process.env.PORT ?? '3000')
}
