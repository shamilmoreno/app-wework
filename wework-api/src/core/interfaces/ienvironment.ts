export interface IEnvironment {
  ENVIRONMENT: string;
  NODE_PORT: string;
  NODE_SERVER: string;
  CLIENT_SERVER: string;
  DB_URI: string;
  DB_SSL: boolean;
  DB_SYNCHRONIZE: boolean;
  DB_LOGGING: any;
  DOCTOR_ID: number;
  EMAIL_SETTING: any;
  EMAIL_PATIENT: string;
}
