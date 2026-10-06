import { Inject, Injectable } from '@nestjs/common';
import { LightState } from '../../domain/entities/light.entity';
import {
  LIGHT_DEVICE_PORT,
  LightDevicePort,
} from '../../domain/ports/light-device.port';

@Injectable()
export class SetLightStateUseCase {
  constructor(
    @Inject(LIGHT_DEVICE_PORT)
    private readonly lightDevice: LightDevicePort,
  ) {}

  async execute(deviceId: string, state: LightState) {
    const confirmedState = await this.lightDevice.setState(
      deviceId,
      state,
    );

    return {
      deviceId,
      state: confirmedState,
      updatedAt: new Date(),
    };
  }
}