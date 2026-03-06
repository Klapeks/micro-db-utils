import { Logger } from "@klapeks/utils";
import type { Consumer, ConsumerConfig, ConsumerRunConfig, EachMessagePayload } from "kafkajs";
import { KafkaConnection } from "./kafka";


const logger = new Logger("Kafka Consumer");

export type KafkaConnectionHandler = (message: any, payload: EachMessagePayload) => any;
export class KafkaConsumer {

    readonly consumer: Consumer;
    constructor(
        readonly connection: KafkaConnection, 
        private readonly config: ConsumerConfig, 
    ) {
        this.consumer = connection.kafka.consumer(config);
    }

    private _needConnection = true;
    async connect() {
        if (!this._needConnection) return;
        await this.consumer.connect();
        this._needConnection = false;
    }
    
    async subscribe(
        topic: string, 
        handler: KafkaConnectionHandler, 
        consumerOptions?: Omit<ConsumerRunConfig, "eachMessage">
    ) {
        if (this._needConnection) {
            await this.connect();
        }
        await this.consumer.subscribe({ 
            topic: topic,
            fromBeginning: true,
        });

        if (!consumerOptions) consumerOptions = {};
        if (!consumerOptions.partitionsConsumedConcurrently) {
            consumerOptions.partitionsConsumedConcurrently = 10
        }

        logger.log("Pre run:", topic);
        await this.consumer.run({
            ...consumerOptions,
            eachMessage: async (payload) => {
                let msg: any = payload.message.value?.toString();
                if (!msg) return;
                try {
                    msg = JSON.parse(msg);
                } catch (err) {}
                await handler(msg, payload);
            },
        });
        logger.log("Listening:", topic);
    }

    async disconnect() {
        await this.consumer.disconnect();
        logger.log("Consumer disconnected:", this.config.groupId);
    }
}
