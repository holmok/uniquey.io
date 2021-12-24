import * as Pulumi from "@pulumi/pulumi";
import * as GCP from "@pulumi/gcp";
import * as Docker from "@pulumi/docker";
import { env } from "process";

const enableCloudRun = new GCP.projects.Service("EnableCloudRun", {
    service: "run.googleapis.com",
});

const location = GCP.config.region || "us-central1";

const apiService = new GCP.cloudrun.Service("uniquey-api-service", {
    location,
    template: {
        spec: {
            containers: [{
                image: `uniquey-api:${env.CIRCLE_SHA1 || "latest"}`,
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

export const apiServiceStatuses = apiService.statuses;