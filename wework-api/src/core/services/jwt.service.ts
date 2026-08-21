import * as jwt from 'jsonwebtoken';
import { User } from '../../database/entities/user';
import config from '../helpers/jwt-secret';

export class JWTService {
  /**
   * Sing JWT, valid for 1 hour
   * @param user
   */
  public generateToken(user: User): string {
    return jwt.sign({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
    },
      config.jwtSecret,
      { expiresIn: '1h' }); // Cambiado a 1 horas
  }

  /**
   * Decoded JWT
   * @param token
   */
  public decodeToken(token: string): any {
    const decodedToken = jwt.decode(token);
    const decoded = jwt.verify(token, config.jwtSecret);
    return decoded;
  }
}
