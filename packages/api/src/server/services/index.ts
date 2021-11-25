import Config from 'config'
import Pino from 'pino'
import SystemServices from './system-services'

class Services {
  private readonly systemService: SystemServices
  constructor (private readonly config: Config.IConfig, private readonly logger: Pino.Logger) {
    this.systemService = new SystemServices(this.logger)
    this.logger.info('Services loaded')
  }

  get system (): SystemServices {
    return this.systemService
  }
}

export default Services
