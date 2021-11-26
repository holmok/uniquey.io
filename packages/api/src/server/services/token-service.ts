import Pino from 'pino'
import Config from 'config'
import JWT from 'jsonwebtoken'
import Uniquey from 'uniquey'
import LRU from 'lru-cache'

export interface Token {
  ip: string
  id: string
}

class TokeService {
  private readonly jwtKey: string
  private readonly uniquey: Uniquey
  private readonly cache: LRU<string, boolean>
  constructor (config: Config.IConfig, private readonly logger: Pino.Logger) {
    this.logger.info('TokeService loaded')
    this.jwtKey = config.get('jwtKey')
    this.uniquey = new Uniquey({ length: 64 })
    this.cache = new LRU<string, boolean>({ maxAge: 1000 * 60 })
  }

  getToken (ip: string): string {
    const already = this.cache.get(ip) ?? false
    if (!already) {
      this.cache.set(ip, true)
      const token: Token = { ip, id: this.uniquey.create() }
      const jwt = JWT.sign(token, this.jwtKey, { expiresIn: '1m' })
      return jwt
    }
    throw new Error('IP already has token.')
  }

  validateToken (ip: string, tokenString: string): string {
    const token = JWT.verify(tokenString, this.jwtKey) as Token
    if (ip === token.ip) return token.id
    throw new Error('Invalid token.')
  }
}

export default TokeService
