import {Response} from 'express';
import {MtRequest, MtResponse} from '../types';

export const responseHandler = (
  controller: (request: MtRequest<any>) => any
) => {
  return async (req: MtRequest<any>, res: Response) => {
    try {
      const {statusCode, body} = await controller(req);
      res.type('json');
      res.status(statusCode).send(body);
    } catch (error) {
      // log the error
      res.status(500).send({
        status: 'error',
        message: 'An unkown error occurred',
      });
    }
  };
};
