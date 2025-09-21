import { Logger } from "@klapeks/utils";
import type { ConfigResourceTypes, ConsumerConfig, Kafka, ProducerConfig } from "kafkajs";
import { KafkaProducer } from "./kafka.producer";
import { KafkaConsumer } from "./kafka.consumer";
import { quietRequire } from "../quiet.require";

const kafkajsModule = quietRequire<typeof import('kafkajs')>('kafkajs')

const logger = new Logger("Kafka");

export const instances = {
    producers: [] as KafkaProducer[],
    consumers: [] as KafkaConsumer[],
}

export class KafkaConnection {

    readonly kafka: Kafka;
    constructor(readonly clientId: string) {
        if (!kafkajsModule) throw "No kafkajs module installed";
        this.kafka = new kafkajsModule.Kafka({
            clientId: clientId,
            brokers: ['localhost:9092'],
            logCreator: () => () => { }
        });
    }

    async createTopic(topic: string, partitions: number, replicas: number) {
        const admin = this.kafka.admin();
        await admin.connect();
        const topics = await admin.fetchTopicMetadata({ topics: [topic] }).catch(err => null);
        logger.log("Topic infos:", topics?.topics);
        if (!topics?.topics.length) {
            await admin.createTopics({
                topics: [{
                    topic: topic,
                    numPartitions: partitions,
                    replicationFactor: replicas
                }],
            });
            logger.log("New topic created:", topic, '|', partitions, '|', replicas);
        } else {
            if (topics.topics[0].partitions.length < partitions) {
                logger.log("Malo partitions:", topics.topics[0].partitions.length);
                // Увеличиваем число партиций
                await admin.createPartitions({
                    topicPartitions: [{
                        topic: topic,
                        count: partitions, // новое общее количество партиций
                    }],
                });
                logger.log("Topic partitions change:", topic, '|', partitions);
            }
        }
        const result = await admin.alterConfigs({
            validateOnly: false,
            resources: [{
                type: kafkajsModule!.ConfigResourceTypes.TOPIC,
                name: topic,
                configEntries: [{
                    name: 'retention.ms', 
                    value: (24 * 60 * 60 * 1000).toString() // 86400000
                }]
            }]
        });
        logger.log("Alter config result:", result);
        await admin.disconnect();
    }

    createProducer(config?: ProducerConfig) {
        return new KafkaProducer(this, config);
    }
    createConsumer(config: ConsumerConfig) {
        return new KafkaConsumer(this, config);
    }

    static async cleanExit() {
        const consumers = instances.consumers;
        const producers = instances.producers;
        instances.producers = [];
        instances.consumers = [];

        for (let c of consumers) {
            await c.disconnect().catch(err => logger.error(err));
        }
        for (let p of producers) {
            await p.disconnect().catch(err => logger.error(err));
        }
    }
}


async function cleanExit() {
    await KafkaConnection.cleanExit();
    process.exit(0);
}
process.on('SIGTERM', async () => {
    await cleanExit();
});
process.on('SIGINT', async () => {
    await cleanExit();
});