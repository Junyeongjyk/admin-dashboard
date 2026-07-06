import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { MqttPublisherService } from "./mqtt.service";
import { DynsecService } from "./dynsec.service";
import { RealtimeCredentialService } from "./realtime-credential.service";
import { CredentialStore } from "../common/store/credential.store";

@Module({
    imports: [
        ClientsModule.register([{
            name: 'MQTT_PUB',
            transport: Transport.MQTT,
            options: {
                url: process.env.MQTT_URL!,
                clientId: `${process.env.MQTT_PUB_CLIENT_ID ?? 'partner-api-pub'}-${process.pid}`,
                password: process.env.MQTT_PASSWORD!,
                username: process.env.MQTT_USERNAME!, 
            }
        }])
    ],
    exports: [ClientsModule, RealtimeCredentialService, MqttPublisherService],
    providers: [MqttPublisherService, DynsecService, RealtimeCredentialService, CredentialStore]
})
export class MqttModule {}