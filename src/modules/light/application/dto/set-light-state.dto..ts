import { IsEnum } from 'class-validator';
import { LightState } from '../../domain/entities/light.entity';

export class SetLightStateDto {
  @IsEnum(LightState)
  state!: LightState;
}