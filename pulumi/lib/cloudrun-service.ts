import * as Pulumi from "@pulumi/pulumi";
import * as GCP from "@pulumi/gcp";

import { env } from "process";

export default function buildCouldRunService(
    enableCloudRun: GCP.projects.Service,
    name: string,
    imageName: string,
    commands: string[],
    envs: GCP.types.input.cloudrun.ServiceTemplateSpecContainerEnv[] = [],
    memory: string = "512Mi"
): Pulumi.Output<string> {

    // get the image from name and build hash as tag
    const image = GCP.container.getRegistryImage({
        tag: env.CIRCLE_SHA1,
        name: imageName
    });

    const location = GCP.config.region || "us-central1";

    const service = new GCP.cloudrun.Service(`${name}-${env.CIRCLE_BRANCH}-service`, {
        location,

        template: {
            spec: {
                containers: [{
                    image: image.then(i => i.imageUrl),
                    resources: {
                        limits: {
                            memory: memory,
                        },
                    },
                    envs: [{ name: "NODE_ENV", value: "production" }, ...envs],
                    commands,
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

    const noAuthIamPolicy = new GCP.cloudrun.IamPolicy(`${name}-no-auth-iam-policy`, {
        location: service.location,
        project: service.project,
        service: service.name,
        policyData: noAuthIAMPolicy.then(noAuthIAMPolicy => noAuthIAMPolicy.policyData),
    });

    return service.statuses[0].url
}