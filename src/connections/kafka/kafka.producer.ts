import type { Message as KafkaMessage, Producer, ProducerConfig } from "kafkajs";
import { KafkaConnection } from "./kafka";
import { Logger } from "@klapeks/utils";

const logger = new Logger("Kafka Producer");

export class KafkaProducer {

    readonly connection: KafkaConnection;
    readonly producer: Producer;
    constructor(connection: KafkaConnection, config?: ProducerConfig) {
        this.connection = connection;
        this.producer = connection.kafka.producer(config);
    }
    
    private _needConnection = true;
    async connect() {
        if (!this._needConnection) return;
        await this.producer.connect();
        this._needConnection = false;
    }

    async sendMessage(topic: string, data: any, options?: Omit<KafkaMessage, "value">) {
        if (this._needConnection) await this.connect();
        const message = (options || {}) as KafkaMessage;
        message.value = JSON.stringify(data);
        await this.producer.send({ topic, messages: [message] });
    }

    async disconnect() {
        await this.producer.disconnect();
        logger.log("Consumer disconnected:", this.connection.clientId);
    }
}
