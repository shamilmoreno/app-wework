import { IEnvironment } from '../interfaces/ienvironment';
export const local: IEnvironment = {
  ENVIRONMENT: 'local',
  NODE_PORT: '3000',
  NODE_SERVER: 'http://localhost:3000',
  CLIENT_SERVER: 'http://localhost:4200',
  //DB_URI: 'postgres://shamil_moreno:business2024$.@10.0.3.19:5432/wework_db',
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
  NODE_PORT: '3000',
  NODE_SERVER: 'https://apigestion.weworkintegrados.com:3000',
  CLIENT_SERVER: 'https://gestion.weworkintegrados.com',
  DB_URI: 'postgres://shamil_moreno:business2024$.@10.0.3.19:5432/wework_db',
  DB_SSL: true,
  DB_SYNCHRONIZE: true,
  DB_LOGGING: false,
  DOCTOR_ID: 1,
  EMAIL_SETTING: {
    host: 'smtp-relay.gmail.com',
    port: 25,
    secure: true,
    auth: {
      user: 'inteligencianegocios2024@gmail.com',
      pass: 'Caracas2023*',
    },
  },
  EMAIL_PATIENT: '',
};
