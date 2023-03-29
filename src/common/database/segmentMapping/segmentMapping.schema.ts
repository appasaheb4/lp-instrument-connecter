import {Schema} from 'mongoose';

const segmentMappingSchema = new Schema({
  instType: String,
  dateOfEntry: Date,
  lastUpdated: Date,
});

export default segmentMappingSchema;
