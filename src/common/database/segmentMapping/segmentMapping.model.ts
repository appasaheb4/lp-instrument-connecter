import {model} from 'mongoose';
import segmentMappingSchema from './segmentMapping.schema';
export const segmentMappingModel: any = model(
  'segmentmappings',
  segmentMappingSchema
);
