import { IEnvironment } from '../interfaces/ienvironment';

export const local: IEnvironment = {
  ENVIRONMENT: 'local',
  NODE_PORT: '3000',
  NODE_SERVER: 'http://localhost:3000',
  CLIENT_SERVER: 'http://localhost:4200',
  DB_URI: 'postgres://postgres:root@127.0.0.1:5432/wework_db',
  DB_SSL: false,
  DB_SYNCHRONIZE: true,
  DB_LOGGING: ['error', 'warn', 'info'],
  DOCTOR_ID: 1,
  EMAIL_SETTING: {
    service: 'smtp-relay.gmail.com',
    auth: {
      user: 'inteligencianegocios2024@gmail.com',
      pass: 'Caracas2023*',
    },
  },
  EMAIL_PATIENT: '',
};

export const production: IEnvironment = {
  ENVIRONMENT: 'production',
  NODE_PORT: process.env.PORT || '3000',
  NODE_SERVER: process.env.NODE_SERVER || 'https://apigestion.weworkintegrados.com:3000',
  CLIENT_SERVER: process.env.CLIENT_SERVER || 'https://gestion.weworkintegrados.com',
  DB_URI: process.env.DB_URI || '',
  DB_SSL: process.env.DB_SSL === 'true',
  DB_SYNCHRONIZE: process.env.DB_SYNCHRONIZE === 'true',
  DB_LOGGING: false,
  DOCTOR_ID: 1,
  EMAIL_SETTING: {
    host: process.env.EMAIL_HOST || 'smtp-relay.gmail.com',
    port: Number(process.env.EMAIL_PORT) || 25,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER || 'inteligencianegocios2024@gmail.com',
      pass: process.env.EMAIL_PASS || 'Caracas2023*',
    },
  },
  EMAIL_PATIENT: '',
};