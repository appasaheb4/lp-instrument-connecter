import {responseHandler} from '../../../response-handler/index';
import {Router} from 'express';
import {HostCommunicationController} from '../../../controller/communication/host-communication/host-communication.controller';

class HostCommunicationRoutes {
  public HostCommunicationRouter: Router;
  constructor() {
    this.HostCommunicationRouter = Router();
    this.initate();
  }
  private initate(): void {
    this.HostCommunicationRouter.post(
      '/connect',
      responseHandler(HostCommunicationController.connect)
    );
  }
}

const HostCommunicationRoute = new HostCommunicationRoutes()
  .HostCommunicationRouter;
export {HostCommunicationRoute};
