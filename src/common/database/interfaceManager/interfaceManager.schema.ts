import {Schema} from 'mongoose';

const interfaceManagerSchema = new Schema({
  interfaceType: String,
  instrumentType: String,
  dateOfEntry: Date,
  lastUpdated: Date,
});

export default interfaceManagerSchema;
