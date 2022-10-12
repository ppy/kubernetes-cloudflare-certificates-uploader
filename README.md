# kubernetes-cloudflare-certificates-uploader

Just a cronjob-ed script to refresh our custom edge certificate on Cloudflare.

This script only handles updating an existing Cloudflare custom edge certificate's `certificate` and `private_key` properties, implementing this API call: https://api.cloudflare.com/#custom-ssl-for-a-zone-edit-ssl-configuration

## Usage

Requires a valid Kubernetes configuration file, either placed in `~/.kube/config` (for development) or at the location indicated by `$KUBECONFIG` (for production).

Required environment variables:
- `API_TOKEN` Cloudflare API Token with "SSL and Certificates" Edit permission on the appropriate zone
- `NAMESPACE_NAME` (only required if not using the current namespace of the provided Kubernetes context)
- `SECRET_NAME` Secret of type `kubernetes.io/tls` that will be uploaded to CF
- `ZONE_ID` Zone ID to which the certificate will be uploaded

## Deployment

See: https://github.com/ppy/helm-charts/tree/master/osu/kubernetes-cloudflare-certificates-uploader
