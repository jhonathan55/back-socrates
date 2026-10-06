export enum LightState {
  ON = 'ON',
  OFF = 'OFF',
}

export class Light {
  constructor(
    public readonly deviceId: string,
    public state: LightState,
    public readonly updatedAt: Date = new Date(),
  ) {}

  turnOn(): void {
    this.state = LightState.ON;
  }

  turnOff(): void {
    this.state = LightState.OFF;
  }
}