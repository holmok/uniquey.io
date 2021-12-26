import * as GCP from "@pulumi/gcp";
import * as Pulumi from "@pulumi/pulumi";
import Services from './lib/cloudrun-service'

const enableCloudRun = new GCP.projects.Service("EnableCloudRun", {
    service: "run.googleapis.com",
});

let config = new Pulumi.Config()

const apiUrl = config.require('api_url')

const api = Services(enableCloudRun, 'uniquey-api', ["yarn", "start:api"])
const web = Services(enableCloudRun, 'uniquey-web', ["yarn", "start:web"], [{ name: "API_URL", value: apiUrl }])


