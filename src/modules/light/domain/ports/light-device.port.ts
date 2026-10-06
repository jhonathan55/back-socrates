import { LightState } from '../entities/light.entity';

export const LIGHT_DEVICE_PORT = Symbol('LIGHT_DEVICE_PORT');

export abstract class LightDevicePort {
  abstract setState(
    deviceId: string,
    state: LightState,
  ): Promise<LightState>;

  abstract getState(deviceId: string): Promise<LightState>;
}