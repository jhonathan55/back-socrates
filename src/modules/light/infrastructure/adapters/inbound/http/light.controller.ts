import {
  Body,
  Controller,
  Get,
  Param,
  Put,
} from '@nestjs/common';

import { GetLightStateUseCase } from '../../../../application/use-cases/get-light-state.use-case';
import { SetLightStateUseCase } from '../../../../application/use-cases/set-light-state.use-case';
import { SetLightStateDto } from '../../../../application/dto/set-light-state.dto.';

@Controller('devices/:deviceId/light')
export class LightController {
  constructor(
    private readonly setLightState: SetLightStateUseCase,
    private readonly getLightState: GetLightStateUseCase,
  ) {}

  @Put()
  changeState(
    @Param('deviceId') deviceId: string,
    @Body() dto: SetLightStateDto,
  ) {
    return this.setLightState.execute(deviceId, dto.state);
  }

  @Get()
  getState(@Param('deviceId') deviceId: string) {
    return this.getLightState.execute(deviceId);
  }
}