import { Kafka } from 'kafkajs';
import { PrismaClient } from '@prisma/client';
import { parse } from './parser.js';
import { sendEmail } from './email.js';
import { sendSol } from './solana.js';
const TOPIC_NAME = "zap-events";
const kafka = new Kafka({
    clientId: 'kafka-consumer',
    brokers: ['localhost:9092']
});
const prismaClient = new PrismaClient();
async function main() {
    const consumer = kafka.consumer({ groupId: 'main-woker' });
    const producer = kafka.producer();
    await producer.connect();
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
                return console.log("No message.value in kafka queue");
            }
            const parsedMessage = JSON.parse(message.value?.toString());
            const zapRunId = parsedMessage.zapRunId;
            const stage = parsedMessage.stage;
            const zapRunDetails = await prismaClient.zapRun.findFirst({
                where: {
                    id: zapRunId,
                },
                include: {
                    zap: {
                        include: {
                            actions: {
                                include: {
                                    type: true
                                }
                            }
                        }
                    }
                }
            });
            const userId = zapRunDetails?.zap.userId;
            const currentAction = zapRunDetails?.zap.actions.find(x => x.sortingOrder === stage);
            if (!currentAction) {
                console.log('currentAction not found');
                return;
            }
            const zapRunMetadata = zapRunDetails?.metadata;
            console.log(zapRunMetadata);
            if (currentAction.actionId === 'email') {
                const emailTemplate = currentAction.metadata?.email;
                const bodyTemplate = currentAction.metadata?.body;
                if (!emailTemplate || !bodyTemplate) {
                    console.log("Missing email or body template in action metadata");
                    return;
                }
                const templateContext = { data: zapRunMetadata };
                const to = parse(emailTemplate, { templateContext });
                const body = parse(bodyTemplate, { templateContext });
                console.log(`Sending email ${to} with body ${body}`);
                await sendEmail(to, body, userId);
            }
            if (currentAction.actionId === 'send-sol') {
                const amount = parse(currentAction.metadata?.amount, { comment: zapRunMetadata });
                const address = parse(currentAction.metadata?.address, zapRunMetadata);
                console.log(`Sending amount ${amount} to ${address}`);
                await sendSol(amount, address);
            }
            const lastStage = (zapRunDetails?.zap.actions?.length || 1) - 1;
            console.log(lastStage);
            console.log(stage);
            if (lastStage !== stage) {
                console.log("pushing back to the queue");
                await producer.send({
                    topic: TOPIC_NAME,
                    messages: [{
                            value: JSON.stringify({
                                stage: stage + 1,
                                zapRunId
                            })
                        }]
                });
            }
            console.log("processing done");
            await consumer.commitOffsets([{
                    topic: TOPIC_NAME,
                    partition: partition,
                    offset: (parseInt(message.offset) + 1).toString() // 5
                }]);
        }
    });
}
main().catch(console.error);
//# sourceMappingURL=index.js.map