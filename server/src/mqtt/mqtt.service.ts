import { Inject, Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { Envelope } from "./types/envelope.types";
import { firstValueFrom } from "rxjs";
import { ClientProxy } from "@nestjs/microservices";

@Injectable()
export class MqttPublisherService implements OnModuleInit {
    private readonly logger = new Logger(MqttPublisherService.name);
    private connected = false;
   
    constructor(@Inject('MQTT_PUB') private readonly client: ClientProxy) {}

    async onModuleInit() {
        try {
            await this.client.connect();
            this.connected = true;
            this.logger.log('MQTT connected');
        } catch (e) {
            this.connected = false;
            this.logger.error('MQTT connect failed', e as any);
            // 여기서 throw 하지 말고, 일단 서버는 살려두는게 개발에 편함
        }
    }

    async publish(topic: string, envelope: Envelope) {
        try {
            if (!this.connected) {
                await this.client.connect();
                this.connected = true;
            }
            await firstValueFrom(this.client.emit(topic, envelope));
        } catch (e) {
            this.logger.error(`MQTT publish failed topic=${topic}`, e as any);
            // throw 하지 않음(원하면 throw)
        }
    }
 

}