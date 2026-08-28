import dotenv from 'dotenv';
import { local, production } from '../helpers/environments';
import { IEnvironment } from '../interfaces/ienvironment';

export const checkEnvironment = () => {
  // Loading the dotenv configuration
  dotenv.config();

  // Getting the variables from environment
  let env: IEnvironment;

  // Check environment
  switch (process.env.NODE_ENV) {
    case 'production': env = production; break;
    default: env = local; break;
  }

  // Return vars
  return env;
};
