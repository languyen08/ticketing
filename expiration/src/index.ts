import { natsWrapper } from "./nats-wrapper";

const start = async () => {
    if (!process.env.NATS_CLIENT_ID) {
        throw new Error('NATS_CLIENT_ID must be denied');
    }
    if (!process.env.NATS_URL) {
        throw new Error('NATS_URL must be denied');
    }
    if (!process.env.NAT_CLUSTER_ID) {
        throw new Error('NAT_CLUSTER_ID must be denied');
    }
    try {
        await natsWrapper.connect(process.env.NAT_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL);

        natsWrapper.client.on('close', () => {
            console.log('NATS connection closed!');
            process.exit();
        });

        process.on('SIGINT', () => natsWrapper.client.close());
        process.on('SIGTERM', () => natsWrapper.client.close());
    } catch (err) {
        console.error(err);
    }
}

start().then(r => console.log("Cannot start tickets service"));
