import { Kafka } from "kafkajs";
import ClickHouseService from "./Clickhouse.service.js";
import { v4 as uuidV4 } from "uuid";

export default class KafkaService {
  constructor() {
    this.clickhouseService = new ClickHouseService();
    this.clickhouseClient = this.clickhouseService.getClient();
    this.kafka = new Kafka({
      clientId: `server-main`,
      brokers: [process.env.KAFKA_BROKER_URL],
      ssl: {
        host: process.env.KAFKA_HOST_URL,
      },
      sasl: {
        username: process.env.KAFKA_USERNAME,
        password: process.env.KAFKA_PASSWORD,
        mechanism: "plain",
      },
    });
    this.consumer = this.kafka.consumer({
      groupId: "server-main-logs-consumer",
    });
  }
  async initConsumer() {
    await this.consumer.connect();
    await this.consumer.subscribe({ topics: ["container-logs"] });
    await this.consumer.run({
      autoCommit: false,
      eachBatch: async  ({
        batch,
        heartbeat,
        commitOffsetsIfNecessary,
        resolveOffset,
      }) =>{
        const messages = batch.messages;
        console.log("Received Messages : ", messages.length);
        for (const message of messages) {
          const stringMsg = message.value.toString();
          const {  DEPLOYMENT_ID, log } = JSON.parse(stringMsg);
          try {
            const { query_id } = await this.clickhouseClient.insert({
              table: "log_events",
              values: [
                { event_id: uuidV4(), deployment_id: DEPLOYMENT_ID, log },
              ],
              format: "JSONEachRow",
            });
            console.log("Inserted into clickhouse : ", query_id);
            await commitOffsetsIfNecessary(message.offset);
            resolveOffset(message.offset);
            await heartbeat();
          } catch (error) {
            console.log("Error Inserting clickhouse db", error);
          }
        }
      },
    });
  }
}
