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
export const imageName = image.then(i => i.name);
const apiService = new GCP.cloudrun.Service("uniquey-api-service", {
    location,
    template: {
        spec: {
            containers: [{
                image: imageName,
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

export default {
    apiServiceStatuses: apiService.statuses,
    image
}