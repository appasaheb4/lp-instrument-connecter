import {StatusCode, MtResponse, MtRequest} from '../../../types';
import {connectDB} from '../../../common/database/database';
const net = require('net');
const EventEmitter = require('events');
import * as dayjs from 'dayjs';
import {conversation} from '../helper';
const eventEmitter = new EventEmitter();
let tcpIpMessages = [];

class _HostCommunicationController {
  startsWithNumber(str) {
    return /^\d/.test(str);
  }
  getNumberAtEnd(str) {
    if (this.startsWithNumber(str)) {
      return Number(str.match(/^\d+/)[0]);
    }
    return null;
  }
  public async connect(request: MtRequest<any>) {
    try {
      const payload = request.body;
      let returnStatus = true;
      if (payload.type == 'tcpIP') {
        try {
          const server = net.createServer();
          const sockets = [];
          const db = connectDB();
          //Start listening on given port and host.
          server.listen(payload.port, payload.host, function () {
            console.log(`Server started on ${payload.host}:${payload.port}`);
            eventEmitter.emit('wsConnectStatus', true);
          });
          server.on('error', (error) => {
            console.log({error});
            eventEmitter.emit('wsConnectStatus', false);
          });
          server.on('connection', function (sock) {
            sockets.push(sock);
            sock.setEncoding('ascii');
            sock.on('data', function (data) {
              let result = JSON.stringify(data)
                .replace(/\\u0002/g, '<STX>')
                .replace(/\\r/g, '<CR>')
                .replace(/\\u0003/g, '<ETX>')
                .replace(/\\n/g, '<LF><LineEnd>')
                .replace(/\\u0004/g, '<EOT>');
              result = JSON.parse(result);
              const arrMessages = result
                .split('<LineEnd>')
                .filter((element) => element);
              console.log(
                `${sock.remoteAddress}:${sock.remotePort} [RCV]: `,
                arrMessages.join('\r\n')
              );
              eventEmitter.emit('pushTcpIpMessage', arrMessages);
              const serverResp = '\u0006';
              sock.write(serverResp);
              console.log(
                `${sock.remoteAddress}:${sock.remotePort} [SND]: `,
                dayjs().format('DD-MM-YY H:m:s:SSS') + ': ' + '<ACK>'
              );
            });
            //Handle when client connection is closed
            sock.on('close', function (data) {
              const index = sockets.findIndex(function (o) {
                return (
                  o.remoteAddress === sock.remoteAddress &&
                  o.remotePort === sock.remotePort
                );
              });
              if (index !== -1) sockets.splice(index, 1);
            });
            //Handle Client connection error.
            sock.on('error', function (error) {
              console.error(
                `${sock.remoteAddress}:${sock.remotePort} Connection Error ${error}`
              );
            });
          });
          // event
          eventEmitter.on('pushTcpIpMessage', async (message) => {
            tcpIpMessages.push(message);
            const finalMessage = tcpIpMessages.flat(1);
            if (finalMessage?.some((item) => item.includes('<EOT>'))) {
              let interfaceManager: any = await db.interfaceManagerModel.find({
                instrumentType: payload.instType,
              });
              interfaceManager =
                interfaceManager?.length > 0 ? interfaceManager[0] : {};
              const segmentMapping = await db.segmentMappingModel.find({
                instType: payload.instType,
              });
              let message = finalMessage.map((item) => {
                if (item == '<EOT>') return;
                let replace = item.replace(/<STX>/g, '');
                if (/^\d/.test(replace)) {
                  const digit = this.getNumberAtEnd(replace).toString()?.length;
                  replace = replace.substring(digit);
                  replace = replace[0].toLowerCase() + replace.slice(1);
                }
                return replace;
              });
              message = message.filter(function (element) {
                return element !== undefined;
              });
              const result = await conversation(
                segmentMapping[0].protocol,
                segmentMapping,
                interfaceManager,
                message.join('')
              );
              console.log({result});
              // const transmittedMsgRes = await db.transmittedMessageModel.create(
              //   {
              //     filter: {
              //       message: result,
              //       instType: payload.instType,
              //     },
              //   } as any
              // );
              // if (transmittedMsgRes) console.log('Transmitted message saved.');
              // else {
              //   console.log('Already updated message.');
              // }
              tcpIpMessages = [];
            }
          });
        } catch (error) {
          eventEmitter.emit('wsConnectStatus', false);
        }
      } else {
        eventEmitter.emit('wsConnectStatus', false);
      }
      eventEmitter.on('wsConnectStatus', async (flag) => {
        returnStatus = flag;
      });
      await setTimeout(() => {}, 1000);
      return {
        statusCode: StatusCode.SUCCESS,
        body: {
          data: {
            message: returnStatus
              ? 'Connection established success'
              : 'Connection not established.Please change port number',
            success: returnStatus ? 1 : 0,
          },
          status: 'success',
        },
      };
    } catch (error: any) {
      return {
        statusCode: StatusCode.BAD_REQUEST,
        body: {
          status: 'error',
          success: 0,
          message: error.message,
        },
      };
    }
  }
}

export const HostCommunicationController = new _HostCommunicationController();
