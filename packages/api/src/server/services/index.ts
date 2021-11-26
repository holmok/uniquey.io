import Config from 'config'
import Pino from 'pino'
import SystemServices from './system-services'
import UniqueyServices from './uniquey-services'
import TokeService from './token-service'

class Services {
  private readonly systemService: SystemServices
  private readonly uniqueyService: UniqueyServices
  private readonly tokenService: TokeService
  constructor (private readonly config: Config.IConfig, private readonly logger: Pino.Logger) {
    this.systemService = new SystemServices(this.logger)
    this.uniqueyService = new UniqueyServices(this.logger)
    this.tokenService = new TokeService(this.config, this.logger)
    this.logger.info('Services loaded')
  }

  get system (): SystemServices {
    return this.systemService
  }

  get uniquey (): UniqueyServices {
    return this.uniqueyService
  }

  get token (): TokeService {
    return this.tokenService
  }
}

export default Services
