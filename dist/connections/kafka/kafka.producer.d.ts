import type { Message as KafkaMessage, Producer, ProducerConfig } from "kafkajs";
import { KafkaConnection } from "./kafka";
export declare class KafkaProducer {
    readonly connection: KafkaConnection;
    readonly producer: Producer;
    constructor(connection: KafkaConnection, config?: ProducerConfig);
    private _needConnection;
    connect(): Promise<void>;
    sendMessage(topic: string, data: any, options?: Omit<KafkaMessage, "value">): Promise<void>;
    disconnect(): Promise<void>;
}
