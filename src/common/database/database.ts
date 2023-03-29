import mongoose, {ConnectOptions} from 'mongoose';
import {interfaceManagerModel} from './interfaceManager/interfaceManager.model';
import {segmentMappingModel} from './segmentMapping/segmentMapping.model';

export const connectDB = () => {
  try {
    mongoose.connect(
      'mongodb+srv://limsplus-portal:limsplus_portal2021@cluster0.wcvye.mongodb.net/limsplus-prod',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      } as ConnectOptions
    );
    const db = mongoose.connection;
    return {
      interfaceManagerModel,
      segmentMappingModel,
      db,
    };
  } catch (error) {
    console.log('db error', {error});
  }
};

export const disconnectDB = () => {
  try {
    mongoose.disconnect();
  } catch (error) {
    console.log('DB', {error});
  }
};
