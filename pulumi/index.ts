import * as GCP from "@pulumi/gcp";

import Services from './lib/cloudrun-service'

const enableCloudRun = new GCP.projects.Service("EnableCloudRun", {
    service: "run.googleapis.com",
});

const api = Services(enableCloudRun, 'uniquey-api', 'uniquey-api', ["yarn", "start:api"])
const web = Services(enableCloudRun, 'uniquey-web', 'uniquey-web', ["yarn", "start:web"], [{ name: "API_URL", value: api }])

export { api, web }