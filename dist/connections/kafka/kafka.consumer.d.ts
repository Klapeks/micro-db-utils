import type { Consumer, ConsumerConfig, ConsumerRunConfig, EachMessagePayload } from "kafkajs";
import { KafkaConnection } from "./kafka";
export type KafkaConnectionHandler = (message: any, payload: EachMessagePayload) => any;
export declare class KafkaConsumer {
    readonly connection: KafkaConnection;
    private readonly config;
    readonly consumer: Consumer;
    constructor(connection: KafkaConnection, config: ConsumerConfig);
    private _needConnection;
    connect(): Promise<void>;
    subscribe(topic: string, handler: KafkaConnectionHandler, consumerOptions?: Omit<ConsumerRunConfig, "eachMessage">): Promise<void>;
    disconnect(): Promise<void>;
}
