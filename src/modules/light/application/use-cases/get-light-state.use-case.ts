import { Inject, Injectable } from '@nestjs/common';
import {
  LIGHT_DEVICE_PORT,
  LightDevicePort,
} from '../../domain/ports/light-device.port';

@Injectable()
export class GetLightStateUseCase {
  constructor(
    @Inject(LIGHT_DEVICE_PORT)
    private readonly lightDevice: LightDevicePort,
  ) {}

  async execute(deviceId: string) {
    const state = await this.lightDevice.getState(deviceId);

    return {
      deviceId,
      state,
      checkedAt: new Date(),
    };
  }
}