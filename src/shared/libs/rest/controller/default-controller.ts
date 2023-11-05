import { Response, Router } from 'express';
import { Controller } from './controller.interface.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../../types/index.js';
import { Logger } from '../../logger/index.js';
import { Route } from '../index.js';
import { StatusCodes } from 'http-status-codes';

const DEFAULT_CONTENT_TYPE = 'application/json';

@injectable()
export abstract class DefaultController implements Controller {
  private readonly _router: Router;

  constructor(
    @inject(Component.Logger) protected readonly logger: Logger
  ) {
    this._router = Router();
  }

  get router() {
    return this._router;
  }

  public addRoute(route: Route): void {
    this._router[route.method](route.path, route.handler.bind(this));
    this.logger.info(
      `Route registered: ${route.method.toUpperCase()} ${route.path}`
    );
  }

  public send<T>(res: Response, statusCode: number, data: T): void {
    res
      .type(DEFAULT_CONTENT_TYPE)
      .status(statusCode)
      .json(data);
  }

  public ok<T>(res: Response, data: T): void {
    this.send<T>(res, StatusCodes.OK, data);
  }

  public created<T>(res: Response, data: T): void {
    this.send<T>(res, StatusCodes.CREATED, data);
  }

  public noContent<T>(res: Response, data: T): void {
    this.send<T>(res, StatusCodes.NO_CONTENT, data);
  }

  public validationError<T>(res: Response, data: T): void {
    this.send<T>(res, StatusCodes.BAD_REQUEST, data);
  }

  public notAuth<T>(res: Response, data: T): void {
    this.send<T>(res, StatusCodes.UNAUTHORIZED, data);
  }

  public forbidden<T>(res: Response, data: T): void {
    this.send<T>(res, StatusCodes.FORBIDDEN, data);
  }
}
