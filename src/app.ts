import * as express from 'express';
import * as cors from 'cors';
const app = express();
import apiRoutes from './routes/index';
import * as formData from 'express-form-data';
const port = 8080;

const allowedOrigins = ['http://localhost:3000'];
app.use(cors());
const corsOptions = {
  origin: (origin: any, callback: any) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Origin not allowed by CORS'));
    }
  },
};
app.options('*', cors(corsOptions));
app.use(formData.parse());
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use('/api', apiRoutes);
app.set('trust proxy', true);
app.get('/*', function (req, res, next) {
  res.setHeader('Last-Modified', new Date().toUTCString());
  next();
});
app.listen(port, () => {
  console.log('Server Initialization Complete');
});
