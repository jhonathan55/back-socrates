import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { DomainException } from '@common/exceptions/domain.exception';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const { status, message, details } = this.resolve(exception);

    if (status >= 500) {
      this.logger.error(
        `[${req.method}] ${req.url} → ${status}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    } else {
      this.logger.warn(`[${req.method}] ${req.url} → ${status}: ${message}`);
    }

    res.status(status).json({
      statusCode: status,
      message,
      ...(details ? { details } : {}),
      timestamp: new Date().toISOString(),
      path: req.url,
    });
  }

  private resolve(exception: unknown): {
    status: number;
    message: string;
    details?: unknown;
  } {
    if (exception instanceof DomainException) {
      return { status: exception.statusCode, message: exception.message };
    }
    if (exception instanceof HttpException) {
      const res = exception.getResponse();
      const message =
        typeof res === 'string'
          ? res
          : (res as Record<string, unknown>)['message'] ?? exception.message;
      const details =
        typeof res === 'object' &&
        Array.isArray((res as Record<string, unknown>)['message'])
          ? (res as Record<string, unknown>)['message']
          : undefined;
      return {
        status: exception.getStatus(),
        message: Array.isArray(message) ? 'Validation failed' : String(message),
        details,
      };
    }
    return { status: 500, message: 'Internal server error' };
  }
}