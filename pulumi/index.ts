import * as GCP from "@pulumi/gcp";

import Services from './lib/cloudrun-service'
import * as DNS from './lib/dns'

const enableCloudRun = new GCP.projects.Service("EnableCloudRun", {
    service: "run.googleapis.com",
});

async function build() {
    const zone = await DNS.buildZone()
    const api = Services(enableCloudRun, 'uniquey-api', 'uniquey-api', ["yarn", "start:api"])
    // const apiDns = DNS.buildRecords(api, zone.name)
    const web = Services(enableCloudRun, 'uniquey-web', 'uniquey-web', ["yarn", "start:web"], [{ name: "API_URL", value: 'https://api.uniquey.io' }])
    // const webDns = DNS.buildRecords(web, zone.name)
}

build().catch(err => {
    console.error(err)
    process.exit(1)
})

