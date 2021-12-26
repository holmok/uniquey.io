import * as Pulumi from "@pulumi/pulumi";
import * as GCP from "@pulumi/gcp";
import { env } from "process";

export async function buildZone(): Promise<GCP.dns.GetManagedZoneResult> {
    const uniquey_io_zone = await GCP.dns.getManagedZone({

        name: "uniquey-io",

    });
    return uniquey_io_zone
}
export function buildRecords(mapping: GCP.cloudrun.DomainMapping, zoneName: string): void {

    const branch = env.CIRCLE_BRANCH
    const isProd = branch === "main" || branch === "master"
    Pulumi.all([mapping.statuses]).apply(([statuses]) => statuses.map(s => {
        const records = s.resourceRecords
        if (records == null) return
        const output = []
        for (const record of records) {
            const recordName = record.name
            const recordType = record.type ?? "A"
            output.push(new GCP.dns.RecordSet("uniquey-io-record-set", {
                managedZone: zoneName,
                name: recordName,
                type: recordType,
                ttl: 300,
                rrdatas: [record.rrdata],
            }))
        }
        return output
    }));

}