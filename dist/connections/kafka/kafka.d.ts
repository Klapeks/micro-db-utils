import { ConsumerConfig, Kafka, ProducerConfig } from "kafkajs";
import { KafkaProducer } from "./kafka.producer";
import { KafkaConsumer } from "./kafka.consumer";
export declare const instances: {
    producers: KafkaProducer[];
    consumers: KafkaConsumer[];
};
export declare class KafkaConnection {
    readonly clientId: string;
    readonly kafka: Kafka;
    constructor(clientId: string);
    createTopic(topic: string, partitions: number, replicas: number): Promise<void>;
    createProducer(config?: ProducerConfig): KafkaProducer;
    createConsumer(config: ConsumerConfig): KafkaConsumer;
    static cleanExit(): Promise<void>;
}
