import {model} from 'mongoose';
import interfaceManagerSchema from './interfaceManager.schema';
export const interfaceManagerModel: any = model(
  'interfacemanagers',
  interfaceManagerSchema
);
