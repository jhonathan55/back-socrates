import {
  BadGatewayException,
  GatewayTimeoutException,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LightState } from '../../../../domain/entities/light.entity';
import { LightDevicePort } from '../../../../domain/ports/light-device.port';

@Injectable()
export class ArduinoLightAdapter implements LightDevicePort {
  private readonly logger = new Logger(ArduinoLightAdapter.name);
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(config: ConfigService) {
    this.baseUrl = config
      .getOrThrow<string>('ARDUINO_BASE_URL')
      .replace(/\/+$/, '');
    this.apiKey = config.getOrThrow<string>('ARDUINO_API_KEY');
  }

  private async request(
    deviceId: string,
    method: 'GET' | 'PUT',
    state?: LightState,
  ): Promise<LightState> {
    const url =
      `${this.baseUrl}/api/devices/` + `${encodeURIComponent(deviceId)}/light`;

    let response: Response;

    try {
      response = await fetch(url, {
        method,
        headers: {
          'x-device-key': this.apiKey,
          ...(method === 'PUT' ? { 'Content-Type': 'application/json' } : {}),
        },
        ...(method === 'PUT' ? { body: JSON.stringify({ state }) } : {}),
        signal: AbortSignal.timeout(3000),
      });
    } catch (error: unknown) {
      const outer = error instanceof Error ? error : undefined;
      const cause =
        outer && typeof outer === 'object' && 'cause' in outer
          ? (outer as { cause?: unknown }).cause
          : undefined;

      const detail =
        cause instanceof Error
          ? `${cause.name}: ${cause.message}`
          : (outer?.message ?? String(error));

      const code =
        cause && typeof cause === 'object' && 'code' in cause
          ? String(cause.code)
          : 'sin código';

      this.logger.error(`Arduino ${method} ${deviceId}: ${detail} [${code}]`);

      if (outer?.name === 'TimeoutError') {
        throw new GatewayTimeoutException(
          'Arduino no respondió dentro del tiempo esperado',
        );
      }

      throw new ServiceUnavailableException(
        'No se pudo establecer conexión con Arduino',
      );
    }

    if (!response.ok) {
      this.logger.error(
        `Arduino ${method} ${deviceId}: HTTP ${response.status}`,
      );

      throw new BadGatewayException(
        'Arduino rechazó la solicitud o respondió con un error',
      );
    }

    try {
      const result: unknown = await response.json();

      if (
        typeof result !== 'object' ||
        result === null ||
        !('state' in result)
      ) {
        throw new Error('Falta el campo state');
      }

      // Ajusta esta comprobación a los valores reales de LightState.
      return result.state as LightState;
    } catch (error: unknown) {
      this.logger.error(
        `Arduino ${method} ${deviceId}: respuesta inválida`,
        error instanceof Error ? error.stack : undefined,
      );

      throw new BadGatewayException('Arduino entregó una respuesta inválida');
    }
  }

  setState(deviceId: string, state: LightState): Promise<LightState> {
    return this.request(deviceId, 'PUT', state);
  }

  getState(deviceId: string): Promise<LightState> {
    return this.request(deviceId, 'GET');
  }
}
