import * as Pulumi from "@pulumi/pulumi";
import * as GCP from "@pulumi/gcp";
import * as Docker from "@pulumi/docker";
import { env } from "process";

const enableCloudRun = new GCP.projects.Service("EnableCloudRun", {
    service: "run.googleapis.com",
});

const location = GCP.config.region || "us-central1";

const image = GCP.container.getRegistryImage({
    tag: env.CIRCLE_SHA1,
    name: "uniquey-api"
});

const apiService = new GCP.cloudrun.Service("uniquey-api-service", {
    location,

    template: {
        spec: {
            containers: [{
                image: image.then(i => i.imageUrl),
                resources: {
                    limits: {
                        memory: "512Mi",
                    },
                },
                envs: [{ name: "NODE_ENV", value: "production" }],
                commands: ["yarn", "start:api"],
            }],
            containerConcurrency: 1,
        },
    },
}, { dependsOn: enableCloudRun });

const noAuthIAMPolicy = GCP.organizations.getIAMPolicy({
    bindings: [{
        role: "roles/run.invoker",
        members: ["allUsers"],
    }],
});
const noAuthIamPolicy = new GCP.cloudrun.IamPolicy("noAuthIamPolicy", {
    location: apiService.location,
    project: apiService.project,
    service: apiService.name,
    policyData: noAuthIAMPolicy.then(noAuthIAMPolicy => noAuthIAMPolicy.policyData),
});

export default {
    serviceUrl: apiService.statuses[0].url,
}