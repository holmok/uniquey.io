import Pino from 'pino'
import { Constants } from '@uniquey.io/common'

export interface ServerOptions {
  host: string
  port: number
}

export const environment = 'development'

export const name: string = `${Constants.name}/${environment}/api`

export const jwtKey = process.env.JWT_KEY ?? 'this-is-a-secret'

export const pino: Pino.LoggerOptions = {
  name: `${name}`,
  level: process.env.LOG_LEVEL ?? 'debug'
}

export const server: ServerOptions = {
  host: 'localhost',
  port: 8081
}
