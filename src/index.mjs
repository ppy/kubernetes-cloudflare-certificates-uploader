/* INIT */

import k8s from '@kubernetes/client-node';

const kc = new k8s.KubeConfig();
kc.loadFromDefault();
const k8sApi = kc.makeApiClient(k8s.CoreV1Api);


/* UPLOAD CERTIFICATE TO CLOUDFLARE */

const namespaceName = process.env['NAMESPACE_NAME'] ?? kc.contexts.find(ctx => ctx.name === kc.currentContext).namespace;
const secret = await k8sApi.readNamespacedSecret(process.env['SECRET_NAME'], namespaceName);

const customCertificates = await (await fetch(`https://api.cloudflare.com/client/v4/zones/${process.env['ZONE_ID']}/custom_certificates`, {
    method: 'GET',
    headers: {
        Authorization: `Bearer ${process.env['API_TOKEN']}`,
    },
})).json();

if(customCertificates.result.length !== 1) {
    throw new Error(`Expected exactly one custom certificate, got ${customCertificates.length}`);
}

const customCertificate = customCertificates.result[0];

await fetch(`https://api.cloudflare.com/client/v4/zones/${process.env['ZONE_ID']}/custom_certificates/${customCertificate.id}`, {
    method: 'PATCH',
    headers: {
        Authorization: `Bearer ${process.env['API_TOKEN']}`,
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        certificate: Buffer.from(secret.body.data['tls.crt'], 'base64').toString('utf-8'),
        private_key: Buffer.from(secret.body.data['tls.key'], 'base64').toString('utf-8'),
    }),
});

console.log('Successfully patched custom certificate');
