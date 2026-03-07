import { Kafka } from 'kafkajs';
const TOPIC_NAME = "zap-events";
const kafka = new Kafka({
    clientId: 'kafka-consumer',
    brokers: ['localhost:9092']
});
async function main() {
    const consumer = kafka.consumer({ groupId: 'main-woker' });
    await consumer.connect();
    await consumer.subscribe({
        topic: TOPIC_NAME, fromBeginning: true
    });
    await consumer.run({
        autoCommit: false,
        eachMessage: async ({ topic, partition, message }) => {
            console.log({
                partition,
                offset: message.offset,
                value: message.value?.toString(),
            });
            if (!message.value?.toString()) {
                return;
            }
        }
    });
}
main().catch(console.error);
//# sourceMappingURL=index.js.map