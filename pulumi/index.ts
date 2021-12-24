import Services from './lib/cloudrun-service'

const api = Services('uniquey-api', 'uniquey-api')
const web = Services('uniquey-web', 'uniquey-web', [{ name: "API_URL", value: api }])

export { api, web }