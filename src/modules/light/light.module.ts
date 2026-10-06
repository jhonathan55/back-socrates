import { Module } from '@nestjs/common';
import { GetLightStateUseCase } from './application/use-cases/get-light-state.use-case';
import { SetLightStateUseCase } from './application/use-cases/set-light-state.use-case';
import { LIGHT_DEVICE_PORT } from './domain/ports/light-device.port';
import { LightController } from './infrastructure/adapters/inbound/http/light.controller';
import { ArduinoLightAdapter } from './infrastructure/adapters/outbound/arduino/arduino-light.adapter';

@Module({
  controllers: [LightController],
  providers: [
    SetLightStateUseCase,
    GetLightStateUseCase,
    {
      provide: LIGHT_DEVICE_PORT,
      useClass: ArduinoLightAdapter,
    },
  ],
  exports: [SetLightStateUseCase, GetLightStateUseCase],
})
export class LightModule {}