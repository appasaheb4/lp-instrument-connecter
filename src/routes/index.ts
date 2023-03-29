import {Router} from 'express';
import {HostCommunicationRoute} from './communication/host-communication';
class Api {
  public apiRouter = Router();
  constructor() {
    this.initate();
  }
  private initate(): void {
    this.apiRouter.use('/communication', HostCommunicationRoute);
  }
}

export default new Api().apiRouter;
