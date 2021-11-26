import Config from 'config'
import Pino from 'pino'
import SystemServices from './system-services'
import UniqueyServices from './uniquey-services'

class Services {
  private readonly systemService: SystemServices
  private readonly uniqueyService: UniqueyServices
  constructor (private readonly config: Config.IConfig, private readonly logger: Pino.Logger) {
    this.systemService = new SystemServices(this.logger)
    this.uniqueyService = new UniqueyServices(this.logger)
    this.logger.info('Services loaded')
  }

  get system (): SystemServices {
    return this.systemService
  }

  get uniquey (): UniqueyServices {
    return this.uniqueyService
  }
}

export default Services
